"""农历集成的配置流程."""
import logging
from typing import Any, Dict, Optional

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
import homeassistant.helpers.config_validation as cv

from .const import DOMAIN, DEFAULT_NAME, CONF_BIRTHDAYS, CONF_NAME, CONF_SOLAR_BIRTHDAY, CONF_LUNAR_BIRTHDAY

_LOGGER = logging.getLogger(__name__)

class LunarConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """处理农历的配置流程."""

    VERSION = 1

    async def async_step_user(
        self, user_input: Optional[Dict[str, Any]] = None
    ) -> FlowResult:
        """处理初始步骤."""
        if user_input is None:
            return self.async_show_form(
                step_id="user",
                data_schema=vol.Schema({
                    vol.Required("name", default=DEFAULT_NAME): str,
                }),
            )

        await self.async_set_unique_id(f"{DOMAIN}_{user_input['name']}")
        self._abort_if_unique_id_configured()

        # 初始化空的生日列表
        user_input[CONF_BIRTHDAYS] = []

        return self.async_create_entry(
            title=user_input["name"],
            data=user_input,
        )
        
    @staticmethod
    def async_get_options_flow(config_entry):
        """获取选项流程."""
        return LunarOptionsFlowHandler(config_entry)


class LunarOptionsFlowHandler(config_entries.OptionsFlow):
    """处理农历的选项流程."""

    def __init__(self, config_entry):
        """初始化选项流程."""
        self.config_entry = config_entry
        self.data = dict(config_entry.data)
        self.birthdays = list(self.data.get(CONF_BIRTHDAYS, []))
        self.current_birthday = None
        self.edit_index = None

    async def async_step_init(self, user_input=None):
        """处理选项流程的初始步骤."""
        return await self.async_step_menu()

    async def async_step_menu(self, user_input=None):
        """显示主菜单."""
        if user_input is not None:
            if user_input["menu_option"] == "add_birthday":
                return await self.async_step_add_birthday()
            elif user_input["menu_option"] == "edit_birthday":
                return await self.async_step_select_birthday()
            elif user_input["menu_option"] == "delete_birthday":
                return await self.async_step_delete_birthday()

        options = ["add_birthday"]
        if self.birthdays:
            options.extend(["edit_birthday", "delete_birthday"])

        return self.async_show_form(
            step_id="menu",
            data_schema=vol.Schema({
                vol.Required("menu_option", default="add_birthday"): vol.In({
                    "add_birthday": "添加生日/纪念日",
                    "edit_birthday": "编辑生日/纪念日",
                    "delete_birthday": "删除生日/纪念日",
                }),
            }),
        )

    async def async_step_add_birthday(self, user_input=None):
        """添加生日/纪念日."""
        errors = {}
        
        if user_input is not None:
            birthday = {
                CONF_NAME: user_input[CONF_NAME],
                CONF_SOLAR_BIRTHDAY: user_input[CONF_SOLAR_BIRTHDAY],
                CONF_LUNAR_BIRTHDAY: user_input[CONF_LUNAR_BIRTHDAY],
            }
            
            # 验证至少有一个生日字段不为空
            if not birthday[CONF_SOLAR_BIRTHDAY] and not birthday[CONF_LUNAR_BIRTHDAY]:
                errors["base"] = "birthday_required"
            else:
                # 验证农历生日格式
                lunar_birthday = birthday[CONF_LUNAR_BIRTHDAY]
                if lunar_birthday:
                    if len(lunar_birthday) != 4 or not lunar_birthday.isdigit():
                        errors[CONF_LUNAR_BIRTHDAY] = "invalid_format"
                    else:
                        try:
                            month = int(lunar_birthday[:2])
                            day = int(lunar_birthday[2:])
                            if month < 1 or month > 12 or day < 1 or day > 30:
                                errors[CONF_LUNAR_BIRTHDAY] = "invalid_date"
                        except ValueError:
                            errors[CONF_LUNAR_BIRTHDAY] = "invalid_format"
                
                # 验证阳历生日格式
                solar_birthday = birthday[CONF_SOLAR_BIRTHDAY]
                if solar_birthday:
                    if len(solar_birthday) != 4 or not solar_birthday.isdigit():
                        errors[CONF_SOLAR_BIRTHDAY] = "invalid_format"
                    else:
                        try:
                            month = int(solar_birthday[:2])
                            day = int(solar_birthday[2:])
                            if month < 1 or month > 12 or day < 1 or day > 31:
                                errors[CONF_SOLAR_BIRTHDAY] = "invalid_date"
                        except ValueError:
                            errors[CONF_SOLAR_BIRTHDAY] = "invalid_format"
                
                if not errors:
                    self.birthdays.append(birthday)
                    self.data[CONF_BIRTHDAYS] = self.birthdays
                    
                    # 更新配置条目
                    self.hass.config_entries.async_update_entry(
                        self.config_entry, data=self.data
                    )
                    return self.async_create_entry(title="", data={})

        return self.async_show_form(
            step_id="add_birthday",
            data_schema=vol.Schema({
                vol.Required(CONF_NAME): str,
                vol.Optional(CONF_SOLAR_BIRTHDAY, default=""): str,
                vol.Optional(CONF_LUNAR_BIRTHDAY, default=""): str,
            }),
            errors=errors,
        )

    async def async_step_select_birthday(self, user_input=None):
        """选择要编辑的生日/纪念日."""
        if user_input is not None:
            self.edit_index = int(user_input["birthday_index"])
            self.current_birthday = self.birthdays[self.edit_index]
            return await self.async_step_edit_birthday()

        if not self.birthdays:
            return await self.async_step_menu()

        birthday_names = {str(i): f"{birthday[CONF_NAME]}" for i, birthday in enumerate(self.birthdays)}
        
        return self.async_show_form(
            step_id="select_birthday",
            data_schema=vol.Schema({
                vol.Required("birthday_index"): vol.In(birthday_names),
            }),
        )

    async def async_step_edit_birthday(self, user_input=None):
        """编辑生日/纪念日."""
        errors = {}
        
        if user_input is not None:
            birthday = {
                CONF_NAME: user_input[CONF_NAME],
                CONF_SOLAR_BIRTHDAY: user_input[CONF_SOLAR_BIRTHDAY],
                CONF_LUNAR_BIRTHDAY: user_input[CONF_LUNAR_BIRTHDAY],
            }
            
            # 验证至少有一个生日字段不为空
            if not birthday[CONF_SOLAR_BIRTHDAY] and not birthday[CONF_LUNAR_BIRTHDAY]:
                errors["base"] = "birthday_required"
            else:
                # 验证农历生日格式
                lunar_birthday = birthday[CONF_LUNAR_BIRTHDAY]
                if lunar_birthday:
                    if len(lunar_birthday) != 4 or not lunar_birthday.isdigit():
                        errors[CONF_LUNAR_BIRTHDAY] = "invalid_format"
                    else:
                        try:
                            month = int(lunar_birthday[:2])
                            day = int(lunar_birthday[2:])
                            if month < 1 or month > 12 or day < 1 or day > 30:
                                errors[CONF_LUNAR_BIRTHDAY] = "invalid_date"
                        except ValueError:
                            errors[CONF_LUNAR_BIRTHDAY] = "invalid_format"
                
                # 验证阳历生日格式
                solar_birthday = birthday[CONF_SOLAR_BIRTHDAY]
                if solar_birthday:
                    if len(solar_birthday) != 4 or not solar_birthday.isdigit():
                        errors[CONF_SOLAR_BIRTHDAY] = "invalid_format"
                    else:
                        try:
                            month = int(solar_birthday[:2])
                            day = int(solar_birthday[2:])
                            if month < 1 or month > 12 or day < 1 or day > 31:
                                errors[CONF_SOLAR_BIRTHDAY] = "invalid_date"
                        except ValueError:
                            errors[CONF_SOLAR_BIRTHDAY] = "invalid_format"
                
                if not errors:
                    self.birthdays[self.edit_index] = birthday
                    self.data[CONF_BIRTHDAYS] = self.birthdays
                    
                    # 更新配置条目
                    self.hass.config_entries.async_update_entry(
                        self.config_entry, data=self.data
                    )
                    return self.async_create_entry(title="", data={})

        return self.async_show_form(
            step_id="edit_birthday",
            data_schema=vol.Schema({
                vol.Required(CONF_NAME, default=self.current_birthday[CONF_NAME]): str,
                vol.Optional(CONF_SOLAR_BIRTHDAY, default=self.current_birthday.get(CONF_SOLAR_BIRTHDAY, "")): str,
                vol.Optional(CONF_LUNAR_BIRTHDAY, default=self.current_birthday.get(CONF_LUNAR_BIRTHDAY, "")): str,
            }),
            errors=errors,
        )

    async def async_step_delete_birthday(self, user_input=None):
        """删除生日/纪念日."""
        if user_input is not None:
            index = int(user_input["birthday_index"])
            del self.birthdays[index]
            self.data[CONF_BIRTHDAYS] = self.birthdays
            
            # 更新配置条目
            self.hass.config_entries.async_update_entry(
                self.config_entry, data=self.data
            )
            return self.async_create_entry(title="", data={})

        if not self.birthdays:
            return await self.async_step_menu()

        birthday_names = {str(i): f"{birthday[CONF_NAME]}" for i, birthday in enumerate(self.birthdays)}
        
        return self.async_show_form(
            step_id="delete_birthday",
            data_schema=vol.Schema({
                vol.Required("birthday_index"): vol.In(birthday_names),
            }),
        )