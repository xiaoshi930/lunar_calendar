"""农历计算优化工具类"""
import threading
from datetime import datetime
from typing import Dict, Tuple, Any
from .lunar_python import Lunar, Solar, LunarMonth


class LunarCacheManager:
    """农历数据缓存管理器，用于优化重复计算"""
    
    def __init__(self):
        self._date_cache: Dict[str, Tuple[Lunar, Solar]] = {}
        self._month_cache: Dict[str, int] = {}
        self._lock = threading.Lock()
    
    def get_date_objects(self, date_str: str) -> Tuple[Lunar, Solar]:
        """获取缓存的日期对象，如果不存在则创建并缓存"""
        with self._lock:
            if date_str not in self._date_cache:
                date_obj = datetime.fromisoformat(date_str)
                lunar_obj = Lunar.fromDate(date_obj)
                solar_obj = Solar.fromDate(date_obj)
                self._date_cache[date_str] = (lunar_obj, solar_obj)
            return self._date_cache[date_str]
    
    def get_month_days(self, year: int, month: int) -> int:
        """获取缓存的农历月份天数"""
        month_key = f"{year}-{month:02d}"
        with self._lock:
            if month_key not in self._month_cache:
                days = LunarMonth.fromYm(year, month).getDayCount()
                self._month_cache[month_key] = days
            return self._month_cache[month_key]
    
    def clear_cache(self):
        """清除所有缓存"""
        with self._lock:
            self._date_cache.clear()
            self._month_cache.clear()
    
    def clear_month_cache(self):
        """仅清除月份数据缓存（保留日期对象缓存）"""
        with self._lock:
            self._month_cache.clear()
    
    def get_cache_stats(self) -> Dict[str, int]:
        """获取缓存统计信息"""
        with self._lock:
            return {
                "date_objects": len(self._date_cache),
                "month_data": len(self._month_cache)
            }


# 全局缓存管理器实例
lunar_cache_manager = LunarCacheManager()
