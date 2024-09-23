const createWarningNotification = () => {
  tinymce.activeEditor.notificationManager.open({
    text: "Die Wortanzahl wurde überschritten. Kürzen Sie Ihren Text,<br />damit Sie das Dokument als PDF exportieren können.",
    type: "warning",
    timeout: 0, // Setting timeout to 0 means the notification won't automatically close
    // closeButton: true, // Enabling a close button
    onClose: function () {
      warningNotification = null;
      // Perform actions when the notification is closed (optional)
      // For example, you can continue with the next editor
      // You can also trigger blur or focus shift here if needed
    },
  });
};

const createErrorNotification = () => {
  tinymce.activeEditor.notificationManager.open({
    text: "Die Wortanzahl wurde überschritten. Kürzen Sie Ihren Text. <br />Danach können Sie das Formular als PDF exportieren.",
    type: "error",
    timeout: 0, // Setting timeout to 0 means the notification won't automatically close
    closeButton: true, // Enabling a close button
    onClose: function () {
      errorNotification = null;
      // Perform actions when the notification is closed (optional)
      // For example, you can continue with the next editor
      // You can also trigger blur or focus shift here if needed
    },
  });
};

function saveProgress() {
  const formData = {
    matricsInput: document.getElementById("matricsInput").value,
    Abgabe: document.getElementById("Abgabe").value,
    Einleitung: tinymce.get("einleitungInput").getContent(),
    Frage: tinymce.get("questionInput").getContent(),
    AntwortKorrekt: tinymce.get("answerCorrectInput").getContent(),
    AntwortFalsch1: tinymce.get("answerFalse1Input").getContent(),
    AntwortFalsch2: tinymce.get("answerFalse2Input").getContent(),
    BegruendungIntro: tinymce.get("reasonIntroduction").getContent(),
    BegruendungAntwort: tinymce.get("reasonAnswers").getContent(),
    Literatur: tinymce.get("literature").getContent(),
    Richtlinie: document.getElementById("citation").value,
    andereRichtlinie: document.getElementById("otherCitation").value,
  };

  // localStorage.setItem("formData", JSON.stringify(formData));
  // alert("Fortschritt wurde gespeichert.");
   try {
    localStorage.setItem("formData", JSON.stringify(formData));
    alert("Der Fortschritt wurde in Ihrem Browserspeicher gespeichert.");
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      // Storage quota exceeded
      alert("Die Bilder sind zu groß. Verringern Sie die Dateigröße und versuchen Sie es erneut.");
    } else {
      // Other localStorage errors
      alert("Beim Speichern ist ein Fehler aufgetreten: " + error.message);
    }
  }
}


// Funktion zum Laden des gespeicherten Zwischenstands aus dem lokalen Speicher
function loadProgress() {
  const savedData = localStorage.getItem("formData");

  if (savedData) {
    const formData = JSON.parse(savedData);
    document.getElementById("matricsInput").value = formData.matricsInput;
    document.getElementById("Abgabe").value = formData.Abgabe;
    tinymce.get("einleitungInput").setContent(formData.Einleitung);
    tinymce.get("questionInput").setContent(formData.Frage);
    tinymce.get("answerCorrectInput").setContent(formData.AntwortKorrekt);
    tinymce.get("answerFalse1Input").setContent(formData.AntwortFalsch1);
    tinymce.get("answerFalse2Input").setContent(formData.AntwortFalsch2);
    tinymce.get("reasonIntroduction").setContent(formData.BegruendungIntro);
    tinymce.get("reasonAnswers").setContent(formData.BegruendungAntwort);
    tinymce.get("literature").setContent(formData.Literatur);
    document.getElementById("citation").value = formData.Richtlinie;
    document.getElementById("otherCitation").value = formData.andereRichtlinie;
  }
}

window.onload = loadProgress;

// Add others text field if other citation was chosen
document.addEventListener("DOMContentLoaded", function () {
  let selectInput = document.getElementById("citation");
  let textInput = document.getElementsByClassName("vis-container")[0];

  function toggleTextInput() {
    if (selectInput.value === "others") {
      textInput.style.display = "inline-block";
      //textInput.style.width = "auto"; // Adjust width as needed
    } else {
      textInput.style.display = "none";
    }
  }

  toggleTextInput();
  selectInput.addEventListener("change", function () {
    toggleTextInput();
  });
});

// Function to check if any editor exceeds the word limit
function checkWordLimit() {
  const editors = tinymce.editors;
  for (let i = 0; i < editors.length; i++) {
    const editor = editors[i];
    const wordcount = editor.plugins.wordcount;
    const numWords = wordcount.body.getWordCount();
    const wordLimit = 300; // Set your word limit here

    if (numWords > wordLimit) {
      return true; // Word limit exceeded
    }
  }
  return false; // Word limit not exceeded
}

function exportToPDF() {
    let form = document.getElementById("myForm");
  if (form.checkValidity()) {
    // Proceed with exporting as PDF
    //console.log("Form is valid. Exporting as PDF...");
    let pdfName = generatePDFName();
    let Matrikelnummer = document.getElementById("matricsInput").value;
    let Schwerpunkt = document.getElementById("Abgabe").value;
    let Einleitung = tinymce.get("einleitungInput").getContent();
    let Frage = tinymce.get("questionInput").getContent();
    let AntwortKorrekt = tinymce.get("answerCorrectInput").getContent();
    let AntwortFalsch1 = tinymce.get("answerFalse1Input").getContent();
    let AntwortFalsch2 = tinymce.get("answerFalse2Input").getContent();
    let BegruendungIntro = tinymce.get("reasonIntroduction").getContent();
    let BegruendungAntwort = tinymce.get("reasonAnswers").getContent();
    let Literatur = tinymce.get("literature").getContent();
    let Richtlinie = document.getElementById("citation").value;
    let andereRichtlinie = document.getElementById("otherCitation").value;
    if (Richtlinie == "others") {
      Richtlinie = andereRichtlinie;
    } else {
      Richtlinie = Richtlinie;
    }

    // Create a new window with the PDF content
    let printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<html><head><title style="display: none">${pdfName}</title><p> Matrikelnummer: ${Matrikelnummer} Schwerpunkt: ${Schwerpunkt}</p></head><body>`
    );
    printWindow.document.write(
      '<h1 style="display: none">' + pdfName + "</h1>"
    );
    printWindow.document.write(
      "<h1>Teilleistung MC-Aufgabe<br />Sommersemester 2024</h1>"
    );
    // printWindow.document.write("<p>" + pdfContent + "</p>");
    printWindow.document.write(
      '<h2 style="break-after: avoid">MC-Aufgabe</h2>'
    );
    printWindow.document.write(
      '<h3 style="break-after: avoid">Einleitung</h3><p>' + Einleitung + "</p>"
    );
    printWindow.document.write(
      '<h3 style="break-after: avoid">Frage oder Arbeitsanweisung</h3><p>' +
        Frage +
        "</p>"
    );
    printWindow.document.write(
      '<h3 style="break-after: avoid">Richtige oder beste Antwort</h3><p>' +
        AntwortKorrekt +
        "</p>"
    );
    printWindow.document.write(
      '<h3 style="break-after: avoid">Falsche Antwort 1</h3><p>' +
        AntwortFalsch1 +
        "</p>"
    );
    printWindow.document.write(
      '<h3 style="break-after: avoid">Falsche Antwort 2</h3><p>' +
        AntwortFalsch2 +
        "</p>"
    );
    printWindow.document.write(
      '<h2 style="break-after: avoid">Begründungen</h2>'
    );

    printWindow.document.write(
      '<h3 style="break-after: avoid">Begründung der Themenauswahl</h3><p>' +
        BegruendungIntro +
        "</p>"
    );
    printWindow.document.write(
      '<h3 style="break-after: avoid">Begründung der Antworten</h3><p>' +
        BegruendungAntwort +
        "</p>"
    );
    printWindow.document.write(
      '<h2 style="break-after: avoid">Optionales Literaturverzeichnis</h2>'
    );
    printWindow.document.write(
      '<div style="text-indent: -0.5in; padding-left: 0.5in;"><p>' +
        Literatur +
        "</p></div>"
    );
    printWindow.document.write(
      "<strong>Zitierrichtlinie: </strong>" + Richtlinie
    );
    printWindow.document.write("</body></html>");
    printWindow.document.close();

    printWindow.onload = function () {
      // Trigger the print function once the content has been fully loaded
      printWindow.print();
    };
  } else {
    // Display custom validation message
    let invalidInputs = form.querySelectorAll(":invalid");
    invalidInputs.forEach(function (input) {
      input.reportValidity();
    });
  }
}
function generatePDFName() {
  const matricsInput = document.getElementById("matricsInput").value;
  const Abgabe = document.getElementById("Abgabe").value;

  const pdfName = `HP5_24_${matricsInput}_MC_${Abgabe}`;
  return pdfName;
}

function resetForm() {
  document.getElementById("myForm").reset(); // Formular zurücksetzen
  var textareas = document.querySelectorAll("textarea");
  textareas.forEach(function (textarea, index) {
    var editor = tinyMCE.get(index);
    if (editor) {
      editor.setContent("");
    }
  });
}

function resetStorage() {
  localStorage.removeItem("formData"); // Replace 'yourKey' with the key under which your data is stored
  alert("Lokaler Speicher wurde gelöscht!");
}

function handleUpload(file) {
  var reader = new FileReader();
  reader.onload = function () {
    var id = "blobid" + new Date().getTime();
    var blobCache = tinymce.activeEditor.editorUpload.blobCache;
    var base64 = reader.result.split(",")[1];
    var blobInfo = blobCache.create(id, file, base64);
    blobCache.add(blobInfo);

    // Get the original width and height of the image
    var img = new Image();
    img.src = reader.result;
    img.onload = function () {
      var originalWidth = this.width;
      var originalHeight = this.height;

      // Calculate the corresponding height to preserve the aspect ratio
      var maxWidth = 526; // Maximum width
      var aspectRatio = originalWidth / originalHeight;
      var newWidth = Math.min(originalWidth, maxWidth);
      var newHeight = newWidth / aspectRatio;

      // Construct the image HTML with inline CSS for width and height
      var imgHtml =
        '<img src="' +
        blobInfo.blobUri() +
        '" alt="' +
        file.name +
        '" style="max-width: ' +
        maxWidth +
        "px; width: " +
        newWidth +
        "px; height: " +
        newHeight +
        'px;">';

      // Insert the image into the editor content
      tinymce.activeEditor.insertContent(imgHtml);
    };
  };
  reader.readAsDataURL(file);
}
