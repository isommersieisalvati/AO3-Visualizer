import { JSDOM } from "jsdom";
import fetch from "node-fetch";

async function getPages(url) {
    try {
        const text = await fetch(url);
        const html = await text.text();
        const doc = new JSDOM(html)
            .window.document;

        const pages = doc.querySelector(
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

export async function getStatistics(
    url
) {
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
            const text = await fetch(
                pageUrl
            );
            const html =
                await text.text();
            const doc = new JSDOM(html)
                .window.document;
            const workItems =
                doc.querySelectorAll(
                    "ol.work.index.group > li"
                );
            workItems.forEach(
                (work) => {
                    works.push(
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
