const URL = "https://teachablemachine.withgoogle.com/models/H3k6IZmjL/";

let model, labelContainer, maxPredictions;

const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("image-preview");

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    imageUpload.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = async () => {
                    imagePreview.innerHTML = ''; // Clear previous image
                    imagePreview.appendChild(img);
                    await predict(img);
                };
            };
            reader.readAsDataURL(file);
        }
    });
}

async function predict(image) {
    const prediction = await model.predict(image);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

init();
