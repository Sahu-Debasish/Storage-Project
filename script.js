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
            // Display the CID (Content Identifier) of the uploaded file as a link
            const link = document.createElement("a");
            link.href = `https://ipfs.io/ipfs/${data.value.cid}`;
            link.textContent = `File uploaded successfully! Open link`;

            // Clear the resultDiv and append the link
            resultDiv.innerHTML = "";
            resultDiv.appendChild(link);

            // Enable the share button
            document.getElementById("shareButton").disabled = false;
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

    // Get the text content (link) from the resultDiv
    const link = resultDiv.firstChild.href;

    // Create a textarea element to copy the link to the clipboard
    const textarea = document.createElement("textarea");
    textarea.value = link;
    document.body.appendChild(textarea);

    // Select and copy the link
    textarea.select();
    document.execCommand("copy");

    // Remove the textarea from the DOM
    document.body.removeChild(textarea);

    alert("Link copied to clipboard!");
}

function shareLink() {
    const resultDiv = document.getElementById("result");

    // Get the text content (link) from the resultDiv
    const link = resultDiv.firstChild.href;

    if (navigator.share) {
        // Use the Web Share API if available
        navigator.share({
            title: "IPFS File",
            text: "Check out this file on IPFS!",
            url: link,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that do not support Web Share API
        alert("Sharing not supported on this browser. You can manually share the link.");
    }
}
