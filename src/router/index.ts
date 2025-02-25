import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

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
      redirect: "/login/",
    },
    {
      path: "/login/",
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
        {
          path: "login",
          component: LoginView,
        },
      ],
    },
  ],
});

// 路由守卫：在每次导航前检查用户是否已登录
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isLoggedIn) {
    // 如果用户未登录，那么任何页面都重定向到/login
    if (to.path !== "/login/") {
      next("/login/");
    } else {
      next();
    }
  } else {
    // 如果用户已登录，那么页面/和/login重定向到/status
    if (to.path === "/" || to.path === "/login/") {
      next("/status");
    } else {
      next();
    }
  }
});

export default router;
