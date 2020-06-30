function initTask(subTask) {

    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 200,
        includeBlocks: {
            groupByCategory: true,
            generatedBlocks: {
                barcode: [
                    'getPixelLuminosity',
                    'setPixelLuminosity',
                    'width',
                    'height',
                    'printResult'
                ]
            },
            standardBlocks: {
                wholeCategories: ["logic", "loops", "math", "texts", "lists", "dicts", "variables", "functions"],
                includeAll: true
            }
        },
        maxInstructions: 100,
        checkEndEveryTurn: false,
        checkEndCondition: function(context, lastTurn) {
            context.gradeResult();
        },
        startingExample: {
            easy: {
               //blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="6P-G!a[HB3yg`(Dde[Ld" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="stroke" id="(,K@f+uid48x]rhsUa9q"><value name="PARAM_0"><shadow type="math_number" id="RKdiI_J-(TBj)UaVY0jy"><field name="NUM">0</field></shadow><block type="color" id="3xp:`V(zl2:+_RCv};9{"><value name="PARAM_0"><shadow type="math_number" id="9Y-QU4+?u[s]Au#*-xQ{"><field name="NUM">255</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id=".FA[VW3uI6pe(@4w9~:p"><field name="NUM">1</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="|oqW-+1RJ+i!Y{xPAVDo"><field name="NUM">1</field></shadow></value></block></value><next><block type="line" id="ucXC:],Iw,4:8Hb92Fex"><value name="PARAM_0"><shadow type="math_number" id="{1p:S((j[U75j2K`cpMT"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="DvC+P.}Fw:kpm3,Fz2tB"><field name="NUM">60</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="kU9zm2li6bXFsq1k#?:2"><field name="NUM">300</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="(?{)6G?rG6n22Ot?0?aA"><field name="NUM">60</field></shadow></value><next><block type="line" id="NofL|e{cxP(hs2(_9!MN"><value name="PARAM_0"><shadow type="math_number" id="Dg}YZoG0SL1vV)iFq|?5"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="ORI|hoNsTOK7bSRFioCY"><field name="NUM">80</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="971803FQ:?tV7op,rs|v"><field name="NUM">300</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="mP(I=zks1a-nMX}[mm68"><field name="NUM">80</field></shadow></value><next><block type="line" id="3k2YRYLez}R==v7YO3YI"><value name="PARAM_0"><shadow type="math_number" id="jEbya-WLKn9we?P?!,L#"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="?FmSuxIfI*A*jFf,YKzD"><field name="NUM">100</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="@E[8780.L.QW@j*Sp4IB"><field name="NUM">300</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="`=]nX0Mk4Fe5TZ{n~fqi"><field name="NUM">100</field></shadow></value></block></next></block></next></block></next></block></next></block></xml>'
               blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="+L{_]kxaXdizg6otEai|" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="printResult" id=":P1Qo?H;pLwHBHdkY?]L"><value name="PARAM_0"><shadow type="text" id="6YwQ6R}zDuF`?w:DDuw6"><field name="TEXT"></field></shadow><block type="getPixelLuminosity" id="v[-m#rZENpm?e`XAbGZ_"><value name="PARAM_0"><shadow type="math_number" id="pdZQSlZvw3/|ph8{*uqr"><field name="NUM">1</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="/jlzCB8?MJH(d(8B?Zom"><field name="NUM">1</field></shadow></value></block></value></block></next></block></xml>'
            }
        }
    }


    subTask.data = {
        easy: [
            {
                valid_result: {
                    type: 'string',
                    data: '011010010100'
                },
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAJCAYAAAAywQxIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAABLSURBVChTY3j48OF/GDYxMfl/8+bN/wEBAWD89OnT/y4uLv+fP38OxtHR0WAxOzu7/zdu3ABjNTU1sBgMMzFQGYwaSDkYcQYyMAAAyjc72weRpLAAAAAASUVORK5CYII='
            }
        ],
        medium: [
            {
                valid_result: {
                    type: 'string',
                    data: '1001100100010010000011111000101010101110'
                },
                image: 'data:image/png;base64,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98CBA47j3HXXXUKIxcXFfr9/9uzZ8Xj8/PPPj8fjNE3vvffetbU1BitHjhx54IEHBoPBkSNHTNN89dVXhRBHjx5VFOWpp5667777ELczZ84wuW0MAd2167pRFO3duxdjJYifLMvHjx+/ePEiNQcMiCgdf7/f/+CDD3744Yc777zTNM2zZ89+8skn6+vrBw4c+PDDD9fX13ft2rWzs/P111+HYXjnnXdevnz5yy+/tG17eXkZOP3yyy87OztbW1tHjx49f/7877//HkXR4cOHt7e3u93u0aNHL1y4cPLkybfffnt9fX1jY+Onn34KguDuu+9eXV1l3kfOqdsoio4fP/7ee+8lSbKzs8OgR2BCNzY29u/f/9lnnzE0aAbQDZH3er0333zz119/TZLk0KFD4/H4/fffz7Ls+++/Nwzj9OnTqqo++uij+/fvxws+8cQTKysr+H9q2rKsY8eOXbx48cqVKysrK0eOHPn777/n8/l333138uRJIcS9996bZdk777xj23a/319ZWaHnw18GQdBMtBGfNE3BFM7VMAyVG/bt2ydJ0urqquM4vV7v448//vHHHy9fvvzss8+mabp37966rv/6669XXnmFurr//vuXl5fjOD527Fi32+UXqN9++43eW5bln3/+mfVM03zrrbfCMPzqq6+++OKLJ598st/vf/rpp5ZlPfTQQ1mWPfPMM6dOnUJ2l5aWHnzwQXDOoJlAvP76651OZ2FhQVGUF154Qdf1IAhWVlam02kYhsjDaDSSP/roI6p/aWlpeXl5cXFxZWXFNM0TJ078888/qqr2ej3Ijd/EDcPAlqPTCBHNI3RHO4CPZJgIj/MRwHALxi+O406nM5lM5vP58vJy84NHp9PZ3NykF0In8GMMDIbD4cbGRrfbpSFHdoQsywgC1LSzs8Pgw3EcwDadTplSz+dzok4LjXTCYAyH0BDYkzbDNE1+82laMRxqHMewPEy1tbWF/YvjmMOnacovmBAMO8b4jMdjouP7Poa1meL+H/jSekqoKAaCAAAAAElFTkSuQmCC'
            }
        ]
    }
    initBlocklySubTask(subTask)
}
initWrapper(initTask, ['easy', 'medium'], null)

/*
setTimeout(function() {
    task.displayedSubTask.changeSpeed(5)
}, 50)
*/