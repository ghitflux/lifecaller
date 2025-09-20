from decimal import Decimal

from django.contrib.auth.models import Group, User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Atendimento
from .models_coef import Coeficiente


class SimulationAPITestCase(APITestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(username="calc", password="123456")
        group, _ = Group.objects.get_or_create(name="calculista")
        self.user.groups.add(group)
        
        # Usar JWT authentication em vez de session authentication
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

        self.atendimento = Atendimento.objects.create(
            cpf="00000000000",
            matricula="123456",
            banco="Banco Teste",
        )
        Coeficiente.objects.create(banco="Banco Teste", parcelas=60, coeficiente=Decimal("0.02"))

    def test_simulate_endpoint_returns_calculated_values(self):
        url = reverse("atendimentos-simulate", args=[self.atendimento.pk])
        payload = {
            "banco": "Banco Teste",
            "parcelas": 60,
            "saldo_devedor": 10000,
            "seguro_banco": 500,
            "percentual_co": 0.1,
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn("coeficiente", data)
        # Comparar como Decimal para evitar problemas de formatação
        self.assertEqual(Decimal(data["coeficiente"]), Decimal("0.02"))
        self.assertTrue(Decimal(data["parcela_total"]) > 0)

    def test_simulate_requires_permission(self):
        other = User.objects.create_user(username="other", password="123456")
        # Criar token JWT para o usuário sem permissão
        refresh = RefreshToken.for_user(other)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        url = reverse("atendimentos-simulate", args=[self.atendimento.pk])
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
