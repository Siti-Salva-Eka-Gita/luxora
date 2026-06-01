from rest_framework.views import APIView
from rest_framework.response import Response
from .generators import SalesReportGenerator


class LaporanPenjualanView(APIView):
    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        generator = SalesReportGenerator(start_date=start_date, end_date=end_date)

        result = generator.generate()

        return Response(result)
