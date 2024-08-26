import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import StatusView from "@/views/StatusView.vue";
import SettingView from "@/views/SettingView.vue";
import DataDisplayView from "@/views/DataDisplayView.vue";
import ToolView from "@/views/ToolView.vue";
import DeviceManageView from "@/views/DeviceManageView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/status",
      name: "status",
      component: StatusView,
    },
    {
      path: "/setting",
      name: "setting",
      component: SettingView,
    },
    {
      path: "/dataDisplay",
      name: "dataDisplay",
      component: DataDisplayView,
    },
    {
      path: "/tool",
      name: "tool",
      component: ToolView,
    },
    {
      path: "/deviceManage",
      name: "deviceManage",
      component: DeviceManageView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"), // 懒加载，测试用页面
    },
  ],
});

export default router;
