setupGapsTableTask({
    easy: {
        tables: [
            {
                schema: [
                    ['*', 'static th'],
                    ['*', 'static td']
                ],
                values: [
                    ['header H1', ''],
                    ['cell A1', ''],
                ]
            }
        ]
    },
    hard: {
        tables: [
            {
                schema: [
                    ['*', 'static th', 'static th'],
                    ['*', 'static td', '*'],
                    ['*', '*', '*'],
                    ['*', '*', 'static td']
                ],
                values: [
                    ['header H1', '', ''],
                    ['cell A1', '', 'cell C2'],
                    ['cell A3', 'cell B3', 'cell C3'],
                    ['cell A4', 'cell B4', '']
                ]
            }
        ]
    }
});