const ageURL = "https://teachablemachine.withgoogle.com/models/s9R8t603v/"; // 나이 예측 모델 URL

let currentModel, labelContainer, maxPredictions;

const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("image-preview");
const description = document.querySelector('.description');
const ageEvaluation = document.getElementById("age-evaluation");

async function init() {
    await loadModel(ageURL);

    labelContainer = document.getElementById("label-container");
    imageUpload.addEventListener("change", handleImageUpload);
}

async function loadModel(url) {
    const modelURL = url + "model.json";
    const metadataURL = url + "metadata.json";
    currentModel = await tmImage.load(modelURL, metadataURL);
    maxPredictions = currentModel.getTotalClasses();
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
    prediction.sort((a, b) => b.probability - a.probability);

    labelContainer.innerHTML = "";
    ageEvaluation.innerHTML = "";

    const resultTitle = document.createElement("h3");
    resultTitle.innerHTML = `얼굴 나이 예측 결과: ${prediction[0].className}`;
    labelContainer.appendChild(resultTitle);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            `${prediction[i].className}: ${Math.round(prediction[i].probability * 100)}%`;
        const div = document.createElement("div");
        div.innerHTML = classPrediction;
        labelContainer.appendChild(div);
    }

    const evaluation = document.createElement("div");
    evaluation.innerHTML = `
        <p style="margin-top: 20px; font-weight: bold;">얼굴나이 평가</p>
        <p>와, 정말 동안이시네요!</p>
        <p>피부 관리를 정말 잘하시는 것 같아요.</p>
        <p>생기 넘치는 모습이 보기 좋습니다!</p>
    `;
    ageEvaluation.appendChild(evaluation);
}

init();
