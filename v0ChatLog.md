我们选择把程序的结构建好，我们需要建立三个不同的主系统：

1 前台网站，用于对外显示，具体功能；这个功能里的代码统一放在 website 目录下（包括 app 或是 components）: 1. 首页 2. 活动 3. 场地 4. 价格 5. 我们

2 用户活动管理：用于 SAAS 的用户活动的使用;这个功能里的代码统一放在 saas 目录下（包括 app 或是 components）: 1. 活动介绍 2. 活动注册 3. 活动嘉宾 4. 活动日程 5. 活动展商 6. 活动资料 7. 活动咨询 8. 活动视频 9. 活动照片 10. 活动直播 11. 活动互动

3 后台控制：用于整体的内容管理和权限管理和数据管理;这个功能里的代码统一放在 admin 目录下（包括 app 或是 components）:
具体功能： 1. 网站管理 2. 活动管理 3. 场地管理 4. 互动管理 5. 数据统计 6. 权限管理

三个系统之间通过 API 接口进行通信，支持多语言环境，通过 i18n，数据库用 mysql + prisma 驱动。注册登录通过 clerk.

先打地基：装环境/装软件，项目初始化
搭建砖瓦：写 api / 写 web 页面 / 创建数据库 / 读写数据 / 调用 AI 接口
接通水电：web 页面与 api 联调，打通数据流
室内装修：使用 UI 组件对页面进行美化
宴请宾客：发布上线，绑定域名，让所有人都能访问

250108
好的，我们现在针对 现在做的，关于活动的前后功能，更细的更新。目前所有功能都能跑通，但小的问题不少。
1 后台活动列表：标题需要加粗，活动日期：如果是今天，显示为红色，如果是明天，显示为橙色，如果是昨天，显示为灰色，如果相同的年月，只显示一次年月。是否付费，如果需要付费，显示付费金额，不需要付费，显示免费。操作：管理按钮颜色为蓝色。审核，需要显示审核状态，审核通过，显示绿色，审核不通过，显示红色。发布和推荐也要在操作栏中审核。整体列表再美化一下。

2 创建活动：封面图片，请使用附件上传功能，上传成功后，显示图片，点击图片，可以预览，点击删除，可以删除图片。活动日期，选择日期，选择时间，选择结束时间，结束时间不能小于开始时间。是否付费：点击后，在旁边显示输入框，输入金额，如果为免费就不点击，如果为付费，就必填的判断。（目前没有点击，输入金额也会必填的判断，需要修改）

3 管理活动- 注册：添加按钮移动 到下面；操作：编辑没有反应，审核界面功能有误；需要以注册列表面上面加搜索和赛选查询的功能；注册功能没有用到 zod 验证，需要添加；

4 管理活动 - 嘉宾：添加嘉宾功能没有用到 zod 验证，需要添加；照片需要使用上传组件；没有编辑功能。

5 管理活动 - 日程：添加活动功能没有用到 zod 验证，需要添加；时间 段的选择 需要使用日期选择组件；没有编辑功能。

6 管理活动 - 展商：展商功能没有用到 zod 验证，需要添加；展商的 logo 需要使用上传组件；没有编辑功能。

7 管理活动 - 资料：资料功能没有用到 zod 验证，需要添加；没有编辑功能。

8 管理活动 - 咨询：咨询功能没有用到 zod 验证，需要添加；咨询功能可以是新闻的内容，所有需要有头图，内容页面需要是富文本编辑器；没有编辑功能。

9 管理活动 - 视频：视频功能没有用到 zod 验证，需要添加；视频功能可以是视频的内容，所有需要上传视频的功能，没有编辑功能。

10 管理活动 - 图片：图片功能没有用到 zod 验证，需要添加；图片功能可以是图片的内容，所有需要上传图片的功能，没有编辑功能。

11 管理活动 - 直播：直播功能没有用到 zod 验证，需要添加；直播可以一个活动有多场直播，所以可以建立多个直播，每个直播包括封面图，直播标题，直播内容，直播时间，直播状态，直播类型，直播地址，直播状态。

12 前台页面，如果后台有更新，后台更新后，前台页面需要更新，相应显示在前台的页面上。前提状态为审核发布后。

13 前台页面 FeaturedEvents，需要显示活动的封面图，活动标题，活动内容，活动时间，活动状态，活动类型，活动地址，活动状态。

1. 用户管理：需要实现用户注册、登录、修改密码、修改个人信息等功能。
2. 角色管理：需要实现角色的创建、修改、删除等功能。
3. 权限管理：需要实现权限的创建、修改、删除等功能。
4. 菜单管理：需要实现菜单的创建、修改、删除等功能。
5. 日志管理：需要实现日志的记录、查询等功能。
6. 邮件管理：需要实现邮件的发送、接收等功能。
7. 文件管理：需要实现文件的上传、下载、删除等功能。
8. 短信管理：需要实现短信的发送、接收等功能。
9. 支付管理：需要实现支付宝、微信、银联等支付方式的接入、支付、退款等功能。
10. 数据统计：需要实现数据的统计、分析、报表等功能。

2501115
现在，我们要开始 saas 部分的代码开发。 这个部分，需要考虑的问题有：

1. 我们在 website pricing 里已经有注册的功能，所以我们需要考虑如何实现用户注册和登录到 Saas 系统里。这里的界面可以参考：https://v0.dev/chat/login-04-mU3h8K70tcF。需要实现用户注册、登录、修改密码、修改个人信息等功能。用户的后台管理理，需要在admin进行管理。

2 Saas 系统里的功能，我们把我们在 admin 里的 events 的全部功能移动过来就好了。只是要注册，admin 里可以对所有的 events 进行管理，但 Saas 系统里，只能对当前用户下创建的 events 进行管理。并且不可以审核、发布和推荐。

3 关于 events 的界面，如果我们把 events 的界面全部移动过来，那么，这个界面的样式和 admin 里的 events 的界面的样式就完全一样了。我这里希望能用一个新的样式，不用 siadbar 来显示。你想想有什么样式可以用在 saas 里。功能就是用户的 event 管理和用户信息的管理。

实现用户个人资料管理页面
添加更详细的事件管理功能（如参与者管理、日程安排等）
实现密码更改功能
添加仪表板统计信息
