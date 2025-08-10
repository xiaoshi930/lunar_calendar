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
        self._last_midnight = self._get_last_midnight()
        self._attr_device_info = {
            "identifiers": {(DOMAIN, entry_id)},
            "name": name,
            "manufacturer": "Lunar Calendar"
        }
        # 初始化时不立即设置定时器，等待添加到hass后再设置

    @property
    def extra_state_attributes(self) -> Dict[str, Any]:
        """返回状态属性."""
        return self._attributes
        
    async def async_added_to_hass(self) -> None:
        """当实体被添加到 Home Assistant 时调用."""
        await super().async_added_to_hass()
        # 设置每天0点自动更新
        self._setup_midnight_update()
        
    def _get_last_midnight(self) -> datetime:
        """获取上一个0点1秒时间."""
        now = dt_util.now()
        return now.replace(hour=0, minute=0, second=1, microsecond=0)
        
    @callback
    def _setup_midnight_update(self) -> None:
        """设置每天0点1秒自动更新."""
        now = dt_util.now()
        # 计算下一个0点1秒时间（增加容错性）
        next_midnight = now.replace(hour=0, minute=0, second=1, microsecond=0) + timedelta(days=1)
        
        # 计算距离下一个0点1秒的秒数
        delta_seconds = (next_midnight - now).total_seconds()
        
        # 注册一次性计时器，在下一个0点1秒触发更新
        self.hass.loop.call_later(delta_seconds, self._handle_midnight_update)
        
        _LOGGER.debug("农历日期实体：已设置下一次0点1秒更新，将在 %s 触发", next_midnight)

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
        
    @callback
    def _handle_midnight_update(self, *_) -> None:
        """处理0点更新."""
        now = dt_util.now()
        current_midnight = self._get_last_midnight()
        
        # 检查是否已经过了新的一天
        if current_midnight > self._last_midnight:
            self._last_midnight = current_midnight
            # 更新日期为当前日期
            self._attr_native_value = now.date()
            
            # 更新属性
            self._attributes.update({
                "selected_date": now.date().isoformat(),
                "day_of_week": now.strftime("%A"),
                "week_number": now.isocalendar()[1],
                "days_in_month": (now.date().replace(month=now.month % 12 + 1, day=1) if now.month < 12 
                                else now.date().replace(year=now.year + 1, month=1, day=1) - 
                                timedelta(days=1)).day,
                "is_weekend": now.weekday() >= 5,
                "last_updated": now.isoformat()
            })
            
            self.async_write_ha_state()
            _LOGGER.info("农历日期实体：已在0点1秒自动更新日期为 %s", now.date())
            
        # 设置下一次0点更新
        self._setup_midnight_update()
