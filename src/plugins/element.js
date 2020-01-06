import Vue from 'vue'
import {
  Button,
  FormItem,
  Form,
  Input,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItem,
  Submenu,
  MenuItemGroup,
  Col,
  Row,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Option,
  Select,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Tag,
  MessageBox,
  Message
} from 'element-ui'

//这是界面 的方法-1
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Col)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Option)
Vue.use(Select)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)

//这个 是 script 里面的方法 所以要全局挂载到 vue (this里面)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
