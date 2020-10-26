setupGapsTableTask({
    easy: {
        display_output_csv: true,
        display_input_csv: true,                
        tables: [
            {
                values: [
                    ['header ,H1', 'header H2', 'header H3'],
                    ['cell A2', 'cell B2', 'cell C2']
                ]
            },
            {
                values: [
                    ['header H1', 'header H2', 'header H3'],
                    ['cell A2', 'cell B2', 'cell C2']
                ]
            }                    
        ]
    }
});