import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import Outline from "@/components/Outline.vue";
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
      component: LoginView,
    },
    {
      path: "/",
      component: Outline,
      children: [
        {
          path: "status",
          component: StatusView,
        },
        {
          path: "setting",
          component: SettingView,
        },
        {
          path: "dataDisplay",
          component: DataDisplayView,
        },
        {
          path: "tool",
          component: ToolView,
        },
        {
          path: "deviceManage",
          component: DeviceManageView,
        },
      ],
    },
    {
      path: "/about",
      component: () => import("@/views/AboutView.vue"), // 懒加载，用于测试页面
    },
  ],
});

export default router;
