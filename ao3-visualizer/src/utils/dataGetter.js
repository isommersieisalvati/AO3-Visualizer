// function getPages() {
//     const pages =
//         document.querySelector(
//             "ol.pagination.actions"
//         );

//     if (!pages) {
//         return 1;
//     }

//     const listItems =
//         pages.querySelectorAll("li");
//     const lastPageItem =
//         listItems[listItems.length - 2];
//     const lastPageLink =
//         lastPageItem.querySelector("a");

//     return lastPageLink.textContent;
// }

// // Example usage
// console.log(getPages());

import { JSDOM } from "jsdom";

async function getPages(url) {
    try {
        // Fetch the HTML content
        const response = await fetch(
            url
        );
        const text =
            await response.text();

        const dom = new JSDOM(text);
        const document =
            dom.window.document;

        let workPage =
            document.createElement(
                "html"
            );

        workPage.innerHTML = text;

        const pages =
            workPage.querySelector(
                "ol.pagination.actions"
            );

        console.log(pages);

        if (!pages) {
            return 1;
        }

        const listItems =
            pages.querySelectorAll(
                "li"
            );
        const lastPageItem =
            listItems[
                listItems.length - 2
            ];
        const lastPageLink =
            lastPageItem.querySelector(
                "a"
            );

        return lastPageLink.textContent;
    } catch (error) {
        console.error(
            "Error fetching the URL:",
            error
        );
        return null;
    }
}

// Example usage
const url =
    "https://archiveofourown.org/users/Drag0nst0rm/works"; // Replace with your URL
getPages(url).then((lastPage) => {
    console.log("Last page:", lastPage);
});
