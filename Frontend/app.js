document.addEventListener("DOMContentLoaded", () => {
    const rowsPerPage = 10; // Number of rows per page
    let currentPage = 1; // Track current page
    let data = []; // Store fetched data
    const apiKey = "38036600-0d79-40db-a306-4961b9c825bc";

    const tableBody = document.querySelector("tbody");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    const modal = document.getElementById("modal");
    const openModalBtn = document.getElementById("create-asset");
    const closeModalBtn = document.getElementById("close-modal");
    const assetForm = document.getElementById("asset-form");
    const modalContainer1 = document.getElementById("modal-container1");
    const modalContent1 = document.getElementById("modal-content1");
    const closeButton1 = document.getElementById("close-button1");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");


    //----------------------------------------------------------------

    //1. Fetch Data from Server......
    async function fetchDataFromServer() {
        try {
            const response = await fetch("http://localhost:3000/api/assets/", {
                method: "GET",
                headers: { "X-Api-Key": apiKey },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            data = await response.json(); // Assign fetched data to the global array
            populateTable(); // Populate the table after fetching the data
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    //----------------------------------------------------------------

    //2. Fetch data on search....
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent form from submitting the traditional way
        closeButton1.onclick = function () {
            modalContainer1.style.display = "none";
        };

        const assetId = searchInput.value.trim(); // Get the value from input
        // console.log(assetId)

        if (assetId) {
            try {
                // Send GET request with the assetId in the headers or params
                const response = await fetch(
                    `http://localhost:3000/api/assets/${assetId}`,
                    {
                        method: "GET",
                        headers: {
                            "X-Api-Key": apiKey, // Replace with your actual API key
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    // throw new Error(`HTTP error! Status: ${response.status}`);
                    alert(response.statusText);


                } else {
                    let asset_value = await response.json();
                    console.log("GET request successful:", asset_value);
                    modalContent1.innerHTML = `
            <h2>Asset Details</h2>
            <p>ID: ${asset_value.ID}</p>
            <p>Color: ${asset_value.Color}</p>
            <p>Size: ${asset_value.Size}</p>
            <p>AppraisedValue: ${asset_value.AppraisedValue}</p>
            <p>Owner: ${asset_value.Owner}</p>

            
        `;

                    // Display the modal
                    modalContainer1.style.display = "block";
                }
            } catch (error) {
                console.error("Error making GET request:", error);
            }
        } else {
            alert("Please enter a assetId.");
        }
    });
    //----------------------------------------------------------------

    //3. Create an asset...
    assetForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const asset = {
            ID: document.getElementById("assetID").value,
            Color: document.getElementById("color").value,
            Size: document.getElementById("size").value,
            Owner: document.getElementById("owner").value,
            AppraisedValue: document.getElementById("appraised-value").value,
        };
        try {
            const response = await fetch("http://localhost:3000/api/assets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": apiKey,
                },
                body: JSON.stringify(asset),
            });
            // console.log("responce",response);
            // const data = await response.json();
            // console.log(data);
        } catch (error) {
            console.error("Error:", error);
        }
    });
    //----------------------------------------------------------------

    // Populate the table based on the current page
    function populateTable() {
        tableBody.innerHTML = ""; // Clear the table body
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = data.slice(start, end); // Paginate the data

        pageData.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${start + index + 1}</td>
                <td>${item.ID}</td>
                <td>${item.Owner}</td>
                <td>${item.Color}</td>
                <td>${item.AppraisedValue}</td>
                <td>${item.Size}</td>
                <td><button class="delete" assetid="${item.ID}" data-index="${start + index}" >🗑️</button></td>
            `;
            tableBody.appendChild(row);
        });

        addEventListeners(); // Attach event listeners to edit and delete buttons
        updatePagination(); // Update pagination buttons
    }

    // Update pagination UI
    function updatePagination() {
        pageInfo.textContent = `Page ${currentPage}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage * rowsPerPage >= data.length;
    }

    // Handle Edit, Delete, and Transfer button events
    function addEventListeners() {
        document.querySelectorAll(".edit").forEach((button) => {
            button.addEventListener("click", (event) => {
                // console.log(event);
                const assetid = event.target.getAttribute("assetid");
                const index = event.target.getAttribute("data-index");
                console.log(assetid);
                console.log(index);
                editAsset(assetid, index);
            });
        });

        document.querySelectorAll(".delete").forEach((button) => {
            button.addEventListener("click", (event) => {
                // console.log(event);
                const assetid = event.target.getAttribute("assetid");
                const index = event.target.getAttribute("data-index");
                // console.log(assetid)
                deleteAsset(assetid , index);
            });
        });
    }

    // // Edit asset
    // async function editAsset(assetid, index) {
    //     const item = data[index];
    //     console.log(item.ID);
    //     const assetData = {
    //         ID: `${assetid}`,
    //         Color: "black",
    //         Size: 56,
    //         Owner:"ankur",
    //         AppraisedValue: 67
    //     };
    //     console.log(JSON.stringify(assetData))

    //     try {
    //         const response = await fetch(`http://localhost:3000/api/assets/${assetid}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'X-Api-Key': apiKey
    //             },
    //             body: JSON.stringify(assetData)
    //         });
    //         const data = await response.json();
    //         console.log(data);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    //     // const newOwner = prompt("Enter new owner:", item.Owner);
    //     // const newColor = prompt("Enter new color:", item.Color);
    //     // const newValue = prompt("Enter new appraised value:", item.AppraisedValue);
    //     // const newSize = prompt("Enter new size:", item.Size);

    //     // if (newOwner && newColor && newValue && newSize) {
    //     //     data[index] = {
    //     //         ...item,
    //     //         Owner: newOwner,
    //     //         Color: newColor,
    //     //         AppraisedValue: parseInt(newValue, 10),
    //     //         Size: parseInt(newSize, 10)
    //     //     };
    //         populateTable();  // Re-populate the table with updated data
    //     }





    // Delete asset
    async function deleteAsset(assetid , index) {

        if (confirm("Are you sure you want to delete this asset?")) {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/assets/${assetid}`,
                    {
                        method: "DELETE",
                        headers: {
                            "X-Api-Key": apiKey,
                        },
                    }
                );
                
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error("Error:", error);
            }
            
            data.splice(index, 1);
            if (currentPage > Math.ceil(data.length / rowsPerPage)) {
                currentPage--;
            }
            populateTable();
        }
        
    }


    // Handle pagination buttons
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            populateTable();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage * rowsPerPage < data.length) {
            currentPage++;
            populateTable();
        }
    });

    // Modal handling for creating a new asset
    function openModal() {
        modal.style.display = "block";
        assetForm.reset();
        // document.getElementById('asset-id')
    }

    function closeModal() {
        modal.style.display = "none";
    }

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Handle form submission to add a new asset
    assetForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const assetId = document.getElementById("assetID").value;
        const color = document.getElementById("color").value;
        const owner = document.getElementById("owner").value;
        const size = document.getElementById("size").value;
        const appraisedValue = document.getElementById("appraised-value").value;

        const newAsset = {
            ID: assetId,
            Owner: owner,
            Color: color,
            AppraisedValue: parseInt(appraisedValue, 10),
            Size: parseInt(size, 10),
        };

        data.push(newAsset); // Add the new asset to the data array
        populateTable(); // Re-populate the table
        closeModal(); // Close the modal after submission
    });

    // Initial data fetch
    fetchDataFromServer();
    closeModal();
});
