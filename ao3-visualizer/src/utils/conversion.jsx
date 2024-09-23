import * as d3 from "d3";

export const processDates = (
    dateList
) => {
    const convertedList = dateList.map(
        (date) => {
            const [day, month, year] =
                date.split(" ");
            return {
                month,
                year: parseInt(year),
            };
        }
    );

    const counts = {};

    convertedList.forEach(
        ({ month, year }) => {
            const key = `${month}-${year}`;
            counts[key] =
                (counts[key] || 0) + 1;
        }
    );

    return Object.entries(counts).map(
        ([key, count]) => {
            const [month, year] =
                key.split("-");
            return {
                month,
                year: parseInt(year),
                count,
            };
        }
    );
};

export const reduceToFandoms = (
    workList
) => {
    const fandoms = workList
        .map((work) => work[2])
        .flat();

    const fandomCount = fandoms.reduce(
        (acc, item) => {
            acc[item] =
                (acc[item] || 0) + 1;
            return acc;
        },
        {}
    );

    return fandomCount;
};

export const boxplotCaculator = (
    works,
    fandoms
) => {
    let kudos = {};
    for (let work of works) {
        for (let fandom of work[2]) {
            if (fandom in fandoms) {
                if (fandom in kudos) {
                    kudos[fandom].push(
                        Number(
                            work[3].replace(
                                /,/g,
                                ""
                            )
                        )
                    );
                } else {
                    kudos[fandom] = [
                        Number(
                            work[3].replace(
                                /,/g,
                                ""
                            )
                        ),
                    ];
                }
            }
        }
    }

    let data = [];

    for (let fandom in kudos) {
        const sortedKudos = kudos[
            fandom
        ]
            .slice()
            .sort(d3.ascending);
        data.push({
            category: fandom,
            values: [
                d3.min(sortedKudos),
                d3.quantile(
                    sortedKudos,
                    0.25
                ),
                d3.quantile(
                    sortedKudos,
                    0.5
                ),
                d3.quantile(
                    sortedKudos,
                    0.75
                ),
                d3.max(sortedKudos),
                null,
            ],
        });
    }

    return data;
};
