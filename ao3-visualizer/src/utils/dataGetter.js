import { JSDOM } from "jsdom";

async function getPages(url) {
    try {
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

        return Number(
            lastPageLink.textContent
        );
    } catch (error) {
        console.error(
            "Error fetching the URL:",
            error
        );
        return null;
    }
}

function getFicInfo(work) {
    const title = work.querySelector(
        "h4.heading a"
    ).textContent;
    const datetime = work.querySelector(
        "p.datetime"
    ).textContent;
    const fandoms =
        work.querySelector(
            "a.tag"
        ).textContent;
    const kudos = work.querySelector(
        "dd.kudos a"
    ).textContent;

    return [
        title,
        datetime,
        fandoms,
        kudos,
    ];
}

async function getStatistics(url) {
    try {
        const lastPage = await getPages(
            url
        );
        const works = [];

        for (
            let i = 1;
            i <= lastPage;
            i++
        ) {
            const pageUrl = `${url}?page=${i}`;
            const response =
                await fetch(pageUrl);
            const text =
                await response.text();

            const dom = new JSDOM(text);
            const doc =
                dom.window.document;

            const workItems =
                doc.querySelectorAll(
                    "ol.work.index.group > li"
                );

            workItems.forEach(
                (work) => {
                    works.push(
                        getFicInfo(work)
                    );
                    console.log(
                        getFicInfo(work)
                    );
                }
            );
        }

        return works;
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
    "https://archiveofourown.org/users/arriviste/works"; // Replace with your URL
getStatistics(url);
