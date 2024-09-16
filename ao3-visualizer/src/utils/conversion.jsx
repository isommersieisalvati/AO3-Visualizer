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

    // let largeFandoms =
    //     Object.fromEntries(
    //         Object.entries(
    //             fandomCount
    //         ).filter(
    //             ([key, value]) =>
    //                 value >= 10
    //         )
    //     );

    return fandomCount;
};

export const boxplotCaculator = (
    works,
    fandoms
) => {
    works_updated = works.map(
        (work) => [
            work[0], // First item
            ...work.slice(2), // All items after the second
        ]
    );

    fandoms.map((fandom) => {});
};
