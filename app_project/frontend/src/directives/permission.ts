import type { Directive } from "vue";
import { useAuthStore } from "@/store/auth";

/**
 * Usage:
 * - v-permission="'menu:machines:create'"         → ẩn nếu không có quyền
 * - v-permission.disable="'menu:machines:create'" → disable + tooltip
 */
export const vPermission: Directive = {
  mounted(el, binding) {
    const store = useAuthStore();
    const requiredPermission = binding.value;
    const hasPermission = store.permissions.includes(requiredPermission);

    const tooltipText = "You do not have permission to perform this action.";

    if (binding.modifiers.disable) {
      el.disabled = !hasPermission;

      if (!hasPermission) {
        el.setAttribute("title", tooltipText);
        el.classList.add("opacity-50", "cursor-not-allowed");
      } else {
        el.removeAttribute("title");
        el.classList.remove("opacity-50", "cursor-not-allowed");
      }
      return;
    }

    if (!hasPermission) {
      el.style.display = "none";
    }
  }
};
