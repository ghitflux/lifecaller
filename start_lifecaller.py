#!/usr/bin/env python3
"""
Script para inicializar o LifeCaller
- Verifica e executa migrações do Django
- Inicia o servidor backend
- Inicia o servidor frontend
- Verifica se os serviços estão funcionando
"""

import os
import sys
import subprocess
import time
# threading import removed - unused
import signal
from pathlib import Path
import requests
from typing import List

# Configurações
BACKEND_DIR = Path(__file__).parent / "backend"
FRONTEND_DIR = Path(__file__).parent / "lifecaller"
BACKEND_PORT = 5344
FRONTEND_PORT = 5173
BACKEND_URL = f"http://localhost:{BACKEND_PORT}"
FRONTEND_URL = f"http://localhost:{FRONTEND_PORT}"

class Colors:
    """Cores para output no terminal"""
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_status(message: str, status: str = "INFO"):
    """Imprime mensagem com status colorido"""
    color = {
        "INFO": Colors.BLUE,
        "SUCCESS": Colors.GREEN,
        "WARNING": Colors.YELLOW,
        "ERROR": Colors.RED
    }.get(status, Colors.BLUE)
    
    print(f"{color}[{status}]{Colors.END} {message}")

def run_command(command: List[str], cwd: Path, description: str) -> subprocess.Popen:
    """Executa comando em diretório específico"""
    print_status(f"Executando: {description}", "INFO")
    print_status(f"Comando: {' '.join(command)}", "INFO")
    
    try:
        process = subprocess.Popen(
            command,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        return process
    except Exception as e:
        print_status(f"Erro ao executar comando: {e}", "ERROR")
        return None

def find_npm_command():
    """Encontra o comando npm correto para o sistema"""
    # Tenta diferentes formas de encontrar o npm
    npm_commands = ["npm", "npm.cmd", "npx npm"]
    
    # No Windows, tenta o caminho padrão do Node.js
    if os.name == 'nt':  # Windows
        try:
            # Encontra o diretório do Node.js
            node_result = subprocess.run(
                ["node", "-e", "console.log(process.execPath)"], 
                capture_output=True, text=True
            )
            if node_result.returncode == 0:
                node_path = Path(node_result.stdout.strip())
                npm_path = node_path.parent / "npm.cmd"
                if npm_path.exists():
                    npm_commands.insert(0, str(npm_path))
        except Exception:
            pass
    
    # Testa cada comando
    for cmd in npm_commands:
        try:
            if cmd.startswith("npx"):
                result = subprocess.run(cmd.split(), capture_output=True, text=True)
            else:
                result = subprocess.run([cmd, "--version"], capture_output=True, text=True)
            
            if result.returncode == 0:
                return cmd, result.stdout.strip()
        except FileNotFoundError:
            continue
    
    return None, None

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    print_status("Verificando dependências...", "INFO")
    
    # Verifica Python
    if sys.version_info < (3, 8):
        print_status("Python 3.8+ é necessário", "ERROR")
        return False, None
    
    # Verifica Node.js
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode != 0:
            print_status("Node.js não encontrado", "ERROR")
            return False, None
        print_status(f"Node.js: {result.stdout.strip()}", "SUCCESS")
    except FileNotFoundError:
        print_status("Node.js não encontrado", "ERROR")
        return False, None
    
    # Verifica npm
    npm_cmd, npm_version = find_npm_command()
    if not npm_cmd:
        print_status("npm não encontrado", "ERROR")
        return False, None
    
    print_status(f"npm: {npm_version}", "SUCCESS")
    return True, npm_cmd

def check_migrations():
    """Verifica e executa migrações do Django"""
    print_status("Verificando migrações do Django...", "INFO")
    
    # Verifica se há migrações pendentes
    try:
        result = subprocess.run(
            [sys.executable, "manage.py", "showmigrations", "--plan"],
            cwd=BACKEND_DIR,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            print_status(f"Erro ao verificar migrações: {result.stderr}", "ERROR")
            return False
        
        # Verifica se há migrações não aplicadas
        if "[ ]" in result.stdout:
            print_status("Migrações pendentes encontradas. Executando...", "WARNING")
            
            # Executa migrações
            migrate_result = subprocess.run(
                [sys.executable, "manage.py", "migrate"],
                cwd=BACKEND_DIR,
                capture_output=True,
                text=True
            )
            
            if migrate_result.returncode != 0:
                print_status(f"Erro ao executar migrações: {migrate_result.stderr}", "ERROR")
                return False
            
            print_status("Migrações executadas com sucesso!", "SUCCESS")
        else:
            print_status("Todas as migrações estão atualizadas", "SUCCESS")
        
        return True
        
    except Exception as e:
        print_status(f"Erro ao verificar migrações: {e}", "ERROR")
        return False

def install_backend_dependencies():
    """Instala dependências do backend"""
    print_status("Verificando dependências do backend...", "INFO")
    
    requirements_file = BACKEND_DIR / "requirements.txt"
    if not requirements_file.exists():
        print_status("Arquivo requirements.txt não encontrado", "ERROR")
        return False
    
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
            cwd=BACKEND_DIR,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            print_status(f"Erro ao instalar dependências: {result.stderr}", "ERROR")
            return False
        
        print_status("Dependências do backend instaladas", "SUCCESS")
        return True
        
    except Exception as e:
        print_status(f"Erro ao instalar dependências: {e}", "ERROR")
        return False

def install_frontend_dependencies(npm_cmd):
    """Instala dependências do frontend"""
    print_status("Verificando dependências do frontend...", "INFO")
    
    package_json = FRONTEND_DIR / "package.json"
    if not package_json.exists():
        print_status("Arquivo package.json não encontrado", "ERROR")
        return False
    
    node_modules = FRONTEND_DIR / "node_modules"
    if not node_modules.exists():
        print_status("Instalando dependências do frontend...", "INFO")
        
        try:
            # Usa o comando npm correto
            if npm_cmd.startswith("npx"):
                cmd = npm_cmd.split() + ["install"]
            else:
                cmd = [npm_cmd, "install"]
            
            result = subprocess.run(
                cmd,
                cwd=FRONTEND_DIR,
                capture_output=True,
                text=True
            )
            
            if result.returncode != 0:
                print_status(f"Erro ao instalar dependências: {result.stderr}", "ERROR")
                return False
            
            print_status("Dependências do frontend instaladas", "SUCCESS")
        except Exception as e:
            print_status(f"Erro ao instalar dependências: {e}", "ERROR")
            return False
    else:
        print_status("Dependências do frontend já instaladas", "SUCCESS")
    
    return True

def wait_for_service(url: str, service_name: str, timeout: int = 30) -> bool:
    """Aguarda serviço ficar disponível"""
    print_status(f"Aguardando {service_name} ficar disponível em {url}...", "INFO")
    
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code < 500:  # Aceita qualquer resposta que não seja erro de servidor
                print_status(f"{service_name} está disponível!", "SUCCESS")
                return True
        except requests.exceptions.RequestException:
            pass
        
        time.sleep(2)
    
    print_status(f"Timeout aguardando {service_name}", "WARNING")
    return False

def start_backend():
    """Inicia o servidor backend Django"""
    print_status("Iniciando servidor backend...", "INFO")
    
    process = run_command(
        [sys.executable, "manage.py", "runserver", f"0.0.0.0:{BACKEND_PORT}"],
        BACKEND_DIR,
        "Servidor Django"
    )
    
    if process:
        # Aguarda o servidor ficar disponível
        if wait_for_service(f"{BACKEND_URL}/admin/", "Backend Django"):
            return process
    
    return None

def start_frontend(npm_cmd):
    """Inicia o servidor frontend Vite"""
    print_status("Iniciando servidor frontend...", "INFO")
    
    # Usa o comando npm correto
    if npm_cmd.startswith("npx"):
        cmd = npm_cmd.split() + ["run", "dev"]
    else:
        cmd = [npm_cmd, "run", "dev"]
    
    process = run_command(
        cmd,
        FRONTEND_DIR,
        "Servidor Vite"
    )
    
    if process:
        # Aguarda o servidor ficar disponível
        if wait_for_service(FRONTEND_URL, "Frontend Vite"):
            return process
    
    return None

def print_summary():
    """Imprime resumo dos serviços"""
    print("\n" + "="*60)
    print_status("🚀 LifeCaller iniciado com sucesso!", "SUCCESS")
    print("="*60)
    print(f"{Colors.BOLD}Serviços disponíveis:{Colors.END}")
    print(f"  📱 Frontend: {Colors.BLUE}{FRONTEND_URL}{Colors.END}")
    print(f"  🔧 Backend:  {Colors.BLUE}{BACKEND_URL}{Colors.END}")
    print(f"  👤 Admin:    {Colors.BLUE}{BACKEND_URL}/admin/{Colors.END}")
    print("  📚 API Docs: {Colors.BLUE}{BACKEND_URL}/api/schema/swagger-ui/{Colors.END}")
    print("\n" + f"{Colors.BOLD}Usuários de teste:{Colors.END}")
    print("  🔑 Super Admin: admin / admin123")
    print("  👔 Gerente: gerente1 / gerente123")
    print("  👨‍💼 Supervisor: supervisor1 / supervisor123")
    print("  📞 Atendente: atendente1 / atendente123")
    print("  🧮 Calculista: calculista1 / calculista123")
    print("\n" + f"{Colors.YELLOW}Pressione Ctrl+C para parar os servidores{Colors.END}")
    print("="*60)

def signal_handler(signum, frame):
    """Handler para sinais de interrupção"""
    print_status("\nParando servidores...", "WARNING")
    sys.exit(0)

def main():
    """Função principal"""
    print_status("🚀 Iniciando LifeCaller...", "INFO")
    
    # Registra handler para Ctrl+C
    signal.signal(signal.SIGINT, signal_handler)
    
    # Verifica dependências básicas
    deps_ok, npm_cmd = check_dependencies()
    if not deps_ok:
        sys.exit(1)
    
    # Instala dependências
    if not install_backend_dependencies():
        sys.exit(1)
    
    if not install_frontend_dependencies(npm_cmd):
        sys.exit(1)
    
    # Verifica e executa migrações
    if not check_migrations():
        sys.exit(1)
    
    # Inicia servidores
    backend_process = start_backend()
    if not backend_process:
        print_status("Falha ao iniciar backend", "ERROR")
        sys.exit(1)
    
    frontend_process = start_frontend(npm_cmd)
    if not frontend_process:
        print_status("Falha ao iniciar frontend", "ERROR")
        backend_process.terminate()
        sys.exit(1)
    
    # Imprime resumo
    print_summary()
    
    try:
        # Mantém os processos rodando
        while True:
            # Verifica se os processos ainda estão rodando
            if backend_process.poll() is not None:
                print_status("Backend parou inesperadamente", "ERROR")
                break
            
            if frontend_process.poll() is not None:
                print_status("Frontend parou inesperadamente", "ERROR")
                break
            
            time.sleep(1)
    
    except KeyboardInterrupt:
        pass
    
    finally:
        # Para os processos
        print_status("Parando servidores...", "WARNING")
        if backend_process and backend_process.poll() is None:
            backend_process.terminate()
        if frontend_process and frontend_process.poll() is None:
            frontend_process.terminate()
        
        print_status("Servidores parados", "SUCCESS")

if __name__ == "__main__":
    main()