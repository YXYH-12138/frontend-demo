import Vue from "vue"

import {
  Button, Popover, Form, FormItem, Icon, Input, Cascader, Checkbox, Select, Option, Dialog,
  Row, Col,
  DatePicker,
  TimeSelect,
  TimePicker,
  TableColumn,
  Loading,
  Divider,
  Tabs,
  Table,
  TabPane,
  Collapse, CollapseItem,
  Pagination, Menu, MenuItem, Submenu,
  Message,
  Radio, RadioGroup, Switch,
  Notification,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Card, Autocomplete,
  Tag, DropdownMenu, Dropdown, DropdownItem
} from "element-ui"

Vue.use(Button)
Vue.use(Tag)
Vue.use(DropdownMenu)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(Popover)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Input)
Vue.use(Cascader)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Table)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Divider)
Vue.use(Loading.directive)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Pagination)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Switch)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Card)
Vue.use(Autocomplete)

// Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };


Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification