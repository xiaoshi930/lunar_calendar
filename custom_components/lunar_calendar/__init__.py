"""农历信息集成."""
import logging
import os
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.const import Platform
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.frontend import add_extra_js_url

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.SENSOR, Platform.DATE]

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """从配置项设置农历组件."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.data

    # 添加前端资源
    await setup_lunar_calendar_card(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """卸载配置项."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok

async def setup_lunar_calendar_card(hass: HomeAssistant) -> bool:
    lunar_calendar_card_path = '/lunar_calendar_card-local'
    await hass.http.async_register_static_paths([
        StaticPathConfig(lunar_calendar_card_path, hass.config.path('custom_components/lunar_calendar/www'), False)
    ])
    _LOGGER.debug(f"register_static_path: {lunar_calendar_card_path + ':custom_components/lunar_calendar/www'}")
    add_extra_js_url(hass, lunar_calendar_card_path + f"/xiaoshi-lunar-calendar-card.js")
    return True
