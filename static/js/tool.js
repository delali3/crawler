// Add an event listener to the export format dropdown
const exportFormatSelect = document.getElementById('exportFormat');

function exportData(exportFormat, extractedData) {
    if (exportFormat === 'xlsx') {
        // Export data as XLSX
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(extractedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, 'result.xlsx');
    } else if (exportFormat === 'json') {
        // Export data as JSON
        const jsonData = JSON.stringify(extractedData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'result.json';
        a.click();
    } else if (exportFormat === 'xml') {
        // Export data as XML
        let xmlData = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';
        for (let item of extractedData) {
            xmlData += `  <item>${item}</item>\n`;
        }
        xmlData += '</data>';
        let blob = new Blob([xmlData], { type: 'application/xml' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'result.xml';
        a.click();
    } else if (exportFormat === 'txt') {
        // Export data as plain text (TXT)
        const textData = extractedData.join('\n');
        const blob = new Blob([textData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'result.txt';
        a.click();
    } else if (exportFormat === 'html') {
        // Export data as HTML
        let htmlData = '<html><body>\n';
        for (let item of extractedData) {
            htmlData += `  <p>${item}</p>\n`;
        }
        htmlData += '</body></html>';
        let blob = new Blob([htmlData], { type: 'text/html' });
        let url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'result.html';
        a.click();
    } else if (exportFormat === 'docx') {
        // Export data as DOCX
        if (exportFormat === 'docx') {
            // Export data as DOCX
            try {
                // Create a new Blob object containing the DOCX content
                const docxContent = `
                <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                    <w:body>
                        ${extractedData.map(item => `
                            <w:p>
                                <w:r>
                                    <w:t>${item}</w:t>
                                </w:r>
                            </w:p>
                        `).join('')}
                    </w:body>
                </w:document>
                `;

                const blob = new Blob([docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

                // Create a download link and trigger a click event to download the DOCX file
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'result.docx';
                a.click();

            } catch (error) {
                console.error('An error occurred during DOCX generation:', error);
                // Handle the error and provide user feedback
            }
        }
    }
    // Handle other export formats (MD, SQL, LaTeX, Images) here
}


exportFormatSelect.addEventListener('change', () => {
    // When the format is selected, trigger the extractData function
    extractExportData();
});

// Modify the extractData function
function extractData() {
    const pdfFileInput = document.getElementById('pdfFile');
    const keywordsInput = document.getElementById('keywords');
    // const exportFormatSelect = document.getElementById('exportFormat');
    const resultDiv = document.getElementById('result');

    const pdfFile = pdfFileInput.files[0];
    const keywords = keywordsInput.value.split(',');
    // const exportFormat = exportFormatSelect.value; // Get the selected export format

    // if (exportFormat === 'none') {
    //     // No export format selected, show an error message
    //     resultDiv.innerHTML = 'Please select an export format.';
    //     return;
    // }

    if (!pdfFile) {
        resultDiv.innerHTML = 'Please select a PDF file.';
        return;
    }

    if (!keywordsInput.value.trim()) {
        resultDiv.innerHTML = 'Please enter keywords.';
        return;
    }

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);
    formData.append('keywords', keywordsInput.value);
    formData.append('format', exportFormat);

    fetch('https://pdf-upload-coral.vercel.app/process-pdf', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}, Status Text: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if ('error' in data) {
                resultDiv.innerHTML = 'Error: ' + data.error;
            } else {
                resultDiv.innerHTML = 'Extracted Data: ' + JSON.stringify(data.result);

                // Export the data based on the selected format
                // exportData(exportFormat, data.result);
            }
        })
        .catch(error => {
            resultDiv.innerHTML = 'Error: ' + error.message;
        });
}


function extractExportData() {
    const pdfFileInput = document.getElementById('pdfFile');
    const keywordsInput = document.getElementById('keywords');
    // const exportFormatSelect = document.getElementById('exportFormat');
    const resultDiv = document.getElementById('result');

    const pdfFile = pdfFileInput.files[0];
    const keywords = keywordsInput.value.split(',');
    const exportFormat = exportFormatSelect.value; // Get the selected export format

    if (exportFormat === 'none') {
        // No export format selected, show an error message
        resultDiv.innerHTML = 'Please select an export format.';
        return;
    }

    if (!pdfFile) {
        resultDiv.innerHTML = 'Please select a PDF file.';
        return;
    }

    if (!keywordsInput.value.trim()) {
        resultDiv.innerHTML = 'Please enter keywords.';
        return;
    }

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);
    formData.append('keywords', keywordsInput.value);
    formData.append('format', exportFormat);

    fetch('https://pdf-upload-coral.vercel.app/process-pdf', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}, Status Text: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if ('error' in data) {
                resultDiv.innerHTML = 'Error: ' + data.error;
            } else {
                resultDiv.innerHTML = 'Extracted Data: ' + JSON.stringify(data.result);

                // Export the data based on the selected format
                exportData(exportFormat, data.result);
            }
        })
        .catch(error => {
            resultDiv.innerHTML = 'Error: ' + error.message;
        });
}



		//DOM
		const $ = document.querySelector.bind(document);

		//APP
		let App = {};
		App.init = (function () {
			//Init
			function handleFileSelect(evt) {
				const files = evt.target.files; // FileList object

				//files template
				let template = `${Object.keys(files)
					.map(file => `<div class="file file--${file}">
<div class="name"><span>${files[file].name}</span></div>
<div class="progress active"></div>
<div class="done">
<a href="" target="_blank">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000">
<g><path id="path" d="M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10z M500,967.7C241.7,967.7,32.3,758.3,32.3,500C32.3,241.7,241.7,32.3,500,32.3c258.3,0,467.7,209.4,467.7,467.7C967.7,758.3,758.3,967.7,500,967.7z M748.4,325L448,623.1L301.6,477.9c-4.4-4.3-11.4-4.3-15.8,0c-4.4,4.3-4.4,11.3,0,15.6l151.2,150c0.5,1.3,1.4,2.6,2.5,3.7c4.4,4.3,11.4,4.3,15.8,0l308.9-306.5c4.4-4.3,4.4-11.3,0-15.6C759.8,320.7,752.7,320.7,748.4,325z"</g>
</svg>
</a>
</div>
</div>`)
					.join("")}`;

				$("#drop").classList.add("hidden");
				$("footer").classList.add("hasFiles");
				$(".importar").classList.add("active");
				setTimeout(() => {
					$(".list-files").innerHTML = template;
				}, 1000);

				Object.keys(files).forEach(file => {
					let load = 2000 + (file * 2000); // fake load
					setTimeout(() => {
						$(`.file--${file}`).querySelector(".progress").classList.remove("active");
						$(`.file--${file}`).querySelector(".done").classList.add("anim");
					}, load);
				});
			}

			// trigger input
			$("#triggerFile").addEventListener("click", evt => {
				evt.preventDefault();
				$("input[type=file]").click();
			});

			// drop events
			$("#drop").ondragleave = evt => {
				$("#drop").classList.remove("active");
				evt.preventDefault();
			};
			$("#drop").ondragover = $("#drop").ondragenter = evt => {
				$("#drop").classList.add("active");
				evt.preventDefault();
			};
			$("#drop").ondrop = evt => {
				$("input[type=file]").files = evt.dataTransfer.files;
				$("footer").classList.add("hasFiles");
				$("#drop").classList.remove("active");
				evt.preventDefault();
			};

			//upload more
			$(".importar").addEventListener("click", () => {
				$(".list-files").innerHTML = "";
				$("footer").classList.remove("hasFiles");
				$(".importar").classList.remove("active");
				setTimeout(() => {
					$("#drop").classList.remove("hidden");
				}, 500);
			});

			// input change
			$("input[type=file]").addEventListener("change", handleFileSelect);
		})();
