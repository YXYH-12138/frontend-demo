import { ElButton, ElMessage } from "element-plus";
import { defineComponent, h } from "vue";

export const HView = defineComponent({
  setup() {
    const handleClick = () => {
      ElMessage.success("HView");
    };

    return () =>
      h(
        ElButton,
        { type: "primary", onClick: handleClick },
        { default: () => "HView" },
      );
  },
});

export const JsxView = defineComponent({
  setup() {
    const handleClick = () => {
      ElMessage.success("JsxView");
    };

    return () => (
      <ElButton type="primary" onClick={handleClick}>
        JsxView
      </ElButton>
    );
  },
});
