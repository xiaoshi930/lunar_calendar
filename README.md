# 农历万年历

## 功能清单
1、本地计算，没有api  
2、万年历：支持年、月无限制翻页  
3、日历显示内容：阳历、农历、节气、节日、生日/纪念日、假期调休  
4、老黄历显示内容：宜忌、相冲、吉神凶煞、彭祖百忌、福神等  
5、生日/纪念日维护：新增、修改、删除  
6、配套平板端UI、手机端UI  

## 注意事项
1、添加集成以后，确保万年历实体是默认的 sensor.lunar_calendar
2、添加集成以后，确保万年历日期是默认的 date.lunar_tap_date
3、维护生日相关后，需要手动重载集成  

## 配套UI
### 配套UI1：平板端时间显示
![image](https://github.com/xiaoshi930/lunar_calendar/blob/main/image/pad_date.png)  

**引用示例**
~~~
type: custom:lunar-calendar-pad-date
mode: A                            # A是普通时钟，B是翻页时钟
theme: '[[[ return theme() ]]]'    # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
theme_on: rgb(120,40,40)           # 翻页时钟模式下mode: B, theme = on 时的背景色
theme_off: rgb(50,50,50)           # 翻页时钟模式下mode: B, theme = off 时的背景色
filter: number.pad                 # 翻页时钟模式下mode: B, 色相对应的辅助元素实体+自动化改变，实现背景色自动变色（平板ui配套、可忽略）
~~~

  
### 配套UI2：平板端弹出菜单（配合browser mod集成的弹出功能）（也可以单独使用）
![image](https://github.com/xiaoshi930/lunar_calendar/blob/main/image/pad.png)  

**引用示例（单独使用）**
~~~
type: custom:lunar-calendar-pad
theme: '[[[ return theme() ]]]'    # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
~~~

  
### 配套UI3：手机端日期显示
![image](https://github.com/xiaoshi930/lunar_calendar/blob/main/image/phone_date.png)  

**引用示例**
~~~
type: custom:lunar-calendar-phone-date
theme: '[[[ return theme() ]]]'    # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
~~~

  
### 配套UI4：手机端弹出菜单（配合browser mod集成的弹出功能）（也可以单独使用）
![image](https://github.com/xiaoshi930/lunar_calendar/blob/main/image/phone.png)  

**引用示例（单独使用）**
~~~
type: custom:lunar-calendar-phone
theme: '[[[ return theme() ]]]'    # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
~~~

  
### 配套UI5：日历部分单独使用
![image](https://github.com/xiaoshi930/lunar_calendar/blob/main/image/calendar.png)  

**引用示例（单独使用）**
~~~
type: custom:lunar-calendar
theme: '[[[ return theme() ]]]'    # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
~~~


### 配套UI6：其他散件单独使用
**引用示例**
~~~
type: custom:lunar-calendar-head
type: custom:lunar-calendar-body1
type: custom:lunar-calendar-body2
type: custom:lunar-calendar-body3
type: custom:lunar-calendar-body4
type: custom:lunar-calendar-body5
type: custom:lunar-calendar-body6
type: custom:lunar-calendar-body7
type: custom:lunar-calendar-left1
type: custom:lunar-calendar-left2
type: custom:lunar-calendar-left3
type: custom:lunar-calendar-left4
type: custom:lunar-calendar-left5
type: custom:lunar-calendar-left6
type: custom:lunar-calendar-right1
type: custom:lunar-calendar-right2
type: custom:lunar-calendar-right3
type: custom:lunar-calendar-right4
type: custom:lunar-calendar-right5
type: custom:lunar-calendar-right6
~~~
