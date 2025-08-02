"""农历集成的日期平台."""
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from homeassistant.components.date import DateEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """设置农历日期平台."""
    name = entry.data["name"]
    async_add_entities([TapDateEntity(name, entry.entry_id)], True)


class TapDateEntity(DateEntity):
    """点击日期实体的表示."""

    def __init__(self, name: str, entry_id: str) -> None:
        """初始化点击日期实体."""
        self.entity_id = "date.lunar_tap_date"
        self._attr_name = "万年历点击日期"
        self._attr_unique_id = f"{entry_id}lunar_tap_date"
        self._attr_native_value = dt_util.now().date()
        self._attributes: Dict[str, Any] = {}

    @property
    def extra_state_attributes(self) -> Dict[str, Any]:
        """返回状态属性."""
        return self._attributes

    async def async_set_value(self, value: datetime.date) -> None:
        """设置日期值."""
        self._attr_native_value = value
        
        # 更新属性，可以在这里添加与所选日期相关的信息
        self._attributes = {
            "selected_date": value.isoformat(),
            "day_of_week": value.strftime("%A"),
            "week_number": value.isocalendar()[1],
            "days_in_month": (value.replace(month=value.month % 12 + 1, day=1) if value.month < 12 
                             else value.replace(year=value.year + 1, month=1, day=1) - 
                             timedelta(days=1)).day,
            "is_weekend": value.weekday() >= 5,  # 5=Saturday, 6=Sunday
            "last_updated": dt_util.now().isoformat()
        }
        
        self.async_write_ha_state()