<script lang="tsx">
import { defineComponent, PropType } from "vue";
import { ElMenu, ElMenuItem, ElSubMenu } from "element-plus";
import { resolveRouterPath } from "@/utils/main";
import { useRoute, useRouter } from "vue-router";

interface RouterRecord {
  path: string;
  hidden?: boolean;
  meta?: {
    title: string;
  };
  children?: RouterRecord[];
}

export default defineComponent({
  name: "MenuList",
  inheritAttrs: false,
  props: {
    // 显示的菜单
    menus: {
      type: Object as PropType<RouterRecord>,
      required: true
    },
    // 是否开启路由模式
    router: Boolean
  },
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    select: (path: string) => true
  },
  setup(props, { emit, attrs }) {
    const { push } = useRouter();
    const route = useRoute();

    const createMenuItem = (data: RouterRecord[], rootPath = "") => {
      return data.map((item) => {
        const path = resolveRouterPath(rootPath, item.path);

        // const icon = item.meta?.icon;
        return item.children && item.children.length > 0 ? (
          <ElSubMenu
            index={path}
            v-slots={{
              title: () => (
                <>
                  {
                    // icon && <svg-icon icon-name={icon} class="iconfont" />
                  }
                  <span>{item.meta?.title}</span>
                </>
              )
            }}
          >
            {createMenuItem(item.children, path)}
          </ElSubMenu>
        ) : (
          item.hidden || (
            <ElMenuItem index={path}>
              <li class="menu-item">
                {
                  // icon && <svg-icon icon-name={icon} class="iconfont" />
                }
                <span>{item.meta?.title}</span>
              </li>
            </ElMenuItem>
          )
        );
      });
    };

    const handleClick = (path: string) => {
      props.router && push(path);
      emit("select", path);
    };

    return () => {
      const rootPath = resolveRouterPath("/", props.menus.path);
      const defaultActive = route.meta?.activeMenu || route.fullPath;

      return (
        <ElMenu class="menu-list" default-active={defaultActive} {...attrs} onSelect={handleClick}>
          {createMenuItem(props.menus.children || [], rootPath)}
        </ElMenu>
      );
    };
  }
});
</script>

<style lang="scss" scoped>
.menu-list {
  height: 100%;
  background-color: #094fb7;
  border-right: 0;
  :deep(.el-menu-item) {
    font-size: 16px;
    background-color: #094fb7;
    color: white;
    &:hover,
    &.is-active {
      background-color: #fff;
      color: #0149a3;
    }
  }
  :deep(.el-sub-menu) {
    background-color: #094fb7;
    .el-sub-menu__title {
      color: white;
      &:hover {
        color: #0149a3;
      }
    }
  }
}
</style>
