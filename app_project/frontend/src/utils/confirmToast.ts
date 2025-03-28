// src/utils/confirmToast.ts
export function showConfirmToast(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Tạo container cho toast xác nhận với background và border phù hợp
    const container = document.createElement("div");
    container.className =
      "fixed bottom-4 right-4 z-50 flex flex-col items-center p-6 mb-4 bg-gradient-to-br from-gray-800 via-gray-750 to-gray-700 text-gray-200 rounded-lg shadow-lg border border-gray-600";
    
    // Nội dung thông báo và các nút
    container.innerHTML = `
      <div class="text-lg font-medium mb-4">${message}</div>
      <div class="flex space-x-4">
        <button id="confirmYes" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">Xác nhận</button>
        <button id="confirmNo" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none">Hủy</button>
      </div>
    `;
    document.body.appendChild(container);

    // Gán event listener chỉ một lần cho nút "Xác nhận"
    container.querySelector("#confirmYes")?.addEventListener("click", () => {
      resolve(true);
      container.remove();
    }, { once: true });
    
    // Gán event listener chỉ một lần cho nút "Hủy"
    container.querySelector("#confirmNo")?.addEventListener("click", () => {
      resolve(false);
      container.remove();
    }, { once: true });
  });
}
