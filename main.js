const dogCatURL = "https://teachablemachine.withgoogle.com/models/H3k6IZmjL/";
const faceURL = "https://teachablemachine.withgoogle.com/models/Q-gACnF9B/"; // 예시: 얼굴 인식 모델 URL

let currentModel, labelContainer, maxPredictions;
let currentURL = dogCatURL;

const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("image-preview");
const dogCatBtn = document.getElementById("dog-cat-btn");
const faceBtn = document.getElementById("face-btn");
const description = document.querySelector('.description');

async function init() {
    await loadModel(currentURL);

    labelContainer = document.getElementById("label-container");
    imageUpload.addEventListener("change", handleImageUpload);
    dogCatBtn.addEventListener("click", () => switchModel(dogCatURL, dogCatBtn, "분석하고 싶은 이미지를 업로드하세요."));
    faceBtn.addEventListener("click", () => switchModel(faceURL, faceBtn, "얼굴 사진을 업로드하여 분석해보세요."));
}

async function loadModel(url) {
    const modelURL = url + "model.json";
    const metadataURL = url + "metadata.json";
    currentModel = await tmImage.load(modelURL, metadataURL);
    maxPredictions = currentModel.getTotalClasses();
}

async function switchModel(url, button, descText) {
    if (currentURL === url) return; // 이미 선택된 모델이면 변경 안함

    currentURL = url;
    imagePreview.innerHTML = "";
    labelContainer.innerHTML = "";
    document.querySelector(".classifier-selector .active").classList.remove("active");
    button.classList.add("active");
    description.textContent = descText;

    // 로딩 표시 (선택사항)
    labelContainer.innerHTML = "모델을 불러오는 중...";
    await loadModel(url);
    labelContainer.innerHTML = ""; // 로딩 완료 후 텍스트 제거
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async () => {
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
            await predict(img);
        };
    };
    reader.readAsDataURL(file);
}

async function predict(image) {
    const prediction = await currentModel.predict(image);
    labelContainer.innerHTML = ""; // 이전 결과 초기화
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        const div = document.createElement("div");
        div.innerHTML = classPrediction;
        labelContainer.appendChild(div);
    }
}

init();
