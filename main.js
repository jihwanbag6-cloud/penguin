const ageURL = "https://teachablemachine.withgoogle.com/models/s9R8t603v/"; // 나이 예측 모델 URL

let currentModel, labelContainer, maxPredictions;

const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("image-preview");
const description = document.querySelector('.description');
const ageEvaluation = document.getElementById("age-evaluation");

async function init() {
    try {
        await loadModel(ageURL);
        labelContainer = document.getElementById("label-container");
        imageUpload.addEventListener("change", handleImageUpload);
    } catch (error) {
        console.error("초기화 중 오류 발생:", error);
        description.innerHTML = "모델을 로드하는 데 실패했습니다. 페이지를 새로고침 해주세요.";
    }
}

async function loadModel(url) {
    const modelURL = url + "model.json";
    const metadataURL = url + "metadata.json";
    currentModel = await tmImage.load(modelURL, metadataURL);
    maxPredictions = currentModel.getTotalClasses();
}

async function handleImageUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
        console.log("선택된 파일이 없습니다.");
        return;
    }

    const file = files[0];
    const img = new Image();
    const objectURL = URL.createObjectURL(file);

    img.onload = async () => {
        imagePreview.innerHTML = ''; // 기존 미리보기 이미지 제거
        imagePreview.appendChild(img);
        await predict(img);
        URL.revokeObjectURL(objectURL); // 메모리 누수 방지를 위해 URL 해제
    };
    img.onerror = (error) => {
        console.error("이미지 로드 중 오류 발생:", error);
        description.innerHTML = "이미지를 로드하는 데 실패했습니다.";
        URL.revokeObjectURL(objectURL); // 오류 발생 시에도 URL 해제
    };
    img.src = objectURL;
}

async function predict(image) {
    try {
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
    } catch (error) {
        console.error("예측 중 오류 발생:", error);
        description.innerHTML = "얼굴 나이를 예측하는 데 실패했습니다.";
    }
}

init();
