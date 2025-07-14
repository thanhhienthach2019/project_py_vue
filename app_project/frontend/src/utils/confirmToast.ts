export function showConfirmToast(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    container.className =
      "fixed bottom-4 right-4 z-50 max-w-sm w-full p-4 bg-gradient-to-br from-gray-800 via-gray-750 to-gray-700 text-gray-200 rounded-lg shadow-lg border border-gray-600 transition-opacity duration-300 opacity-0";
    container.style.pointerEvents = "auto";

    container.innerHTML = `
      <div class="flex flex-col space-y-4">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0 text-yellow-400 bg-yellow-100 rounded-full p-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.257 3.099c.366-.446.957-.699 1.557-.699s1.191.253 1.557.699l6.857 8.372c.619.756.732 1.838.276 2.717-.456.879-1.374 1.412-2.39 1.412H3.743c-1.016 0-1.934-.533-2.39-1.412-.456-.879-.343-1.961.276-2.717l6.857-8.372z"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium">${message}</div>
            <div class="mt-4 flex justify-end space-x-3">
              <button id="confirmYes" class="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Confirm
              </button>
              <button id="confirmNo" class="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Fade-in effect
    requestAnimationFrame(() => {
      container.classList.remove("opacity-0");
      container.classList.add("opacity-100");
    });

    // Remove toast
    function remove() {
      container.classList.remove("opacity-100");
      container.classList.add("opacity-0");
      setTimeout(() => container.remove(), 300);
    }

    container.querySelector("#confirmYes")?.addEventListener("click", () => {
      resolve(true);
      remove();
    });

    container.querySelector("#confirmNo")?.addEventListener("click", () => {
      resolve(false);
      remove();
    });
  });
}
