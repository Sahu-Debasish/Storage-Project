async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const resultDiv = document.getElementById("result");
    const uploadingMessage = document.querySelector(".uploading-message");

    if (!fileInput.files.length) {
        resultDiv.textContent = "Please select a file.";
        return;
    }

    const file = fileInput.files[0];

    // Show the "Uploading..." message
    uploadingMessage.style.display = "block";

    // Create a FormData object
    const formData = new FormData();
    formData.append("file", file);

    try {
        // Upload the file to nft.storage
        const response = await fetch("https://api.nft.storage/upload", {
            method: "POST",
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ2NGIwODE2N0FkNWQxNDlDMjFiQmY2ZjA4ZjEyQ2E5RmFDODlBZjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwODQzOTQyMDk5MSwibmFtZSI6IkRFViJ9.IVi9dBTusMJ-IiyfhkKx3wA0EC7kYLfcX00m9I8HYiU",
            },
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            // Display the CID (Content Identifier) and Filename of the uploaded file
            resultDiv.textContent = `File uploaded successfully! CID: ${data.value.cid}, Filename: ${file.name}`;
        } else {
            // Handle the error
            resultDiv.textContent = `Error: ${data.error.message}`;
        }
    } catch (error) {
        console.error(error);
        resultDiv.textContent = "An error occurred while uploading the file.";
    } finally {
        // Hide the "Uploading..." message
        uploadingMessage.style.display = "none";
    }
}

function copyLink() {
    const resultDiv = document.getElementById("result");

    // Get the text content (CID) and Filename from the resultDiv
    const cid = resultDiv.textContent.split(": ")[1].split(",")[0];
    const filename = resultDiv.textContent.split(": ")[2].trim();

    // Create a textarea element to copy the text to the clipboard
    const textarea = document.createElement("textarea");
    textarea.value = `https://ipfs.io/ipfs/${cid}/${encodeURIComponent(filename)}`;
    document.body.appendChild(textarea);

    // Select and copy the text
    textarea.select();
    document.execCommand("copy");

    // Remove the textarea from the DOM
    document.body.removeChild(textarea);

    alert("Link copied to clipboard!");
}

async function shareLink() {
    const resultDiv = document.getElementById("result");
    const cid = resultDiv.textContent.split(": ")[1].split(",")[0];
    const filename = resultDiv.textContent.split(": ")[2].trim();
    
    const shareLink = `https://ipfs.io/ipfs/${cid}/${encodeURIComponent(filename)}`;

    try {
        // Check if Web Share API is available
        if (navigator.share) {
            await navigator.share({
                title: "IPFS File Link",
                text: "Check out this IPFS file link!",
                url: shareLink,
            });
        } else {
            // Fallback for browsers that do not support Web Share API
            alert("Web Share API is not supported on this browser.");
        }
    } catch (error) {
        console.error(error);
        alert("Error sharing the link.");
    }
}
