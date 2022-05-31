chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message === "danh-gia-giang-vien") {
    const list = document.querySelectorAll("tbody");

    if (list.length === 0) {
      alert("Không có giảng viên nào để đánh giá");
      return;
    }

    const index = 7;
    const lastIndex = 54;
    for (let i = index; i < list.length - 1; i++) {
      if (i <= lastIndex) {
        list[i].querySelectorAll("tr")[1].querySelector("input").click();
      } else {
        list[i].querySelector("textarea").value = "oke";
      }
    }
    location.href = "#52";
  }
});
