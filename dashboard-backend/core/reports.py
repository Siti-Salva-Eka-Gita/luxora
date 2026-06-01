from abc import ABC, abstractmethod


class AbstractReportGenerator(ABC):
    def __init__(self, start_date=None, end_date=None):
        self._start_date = start_date
        self._end_date = end_date

    @abstractmethod
    def generate(self):
        pass

    @abstractmethod
    def get_summary(self):
        pass

    @abstractmethod
    def get_detail(self):
        pass

    def get_date_range_display(self):
        if self._start_date and self._end_date:
            return f"{self._start_date} — {self._end_date}"
        return "Semua Waktu"
