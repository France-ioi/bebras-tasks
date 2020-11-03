function initTask(subTask) {

    subTask.gridInfos = {
        //blocksLanguage: 'fr',

        /*
        blocksLanguage: {
            python: 'fr',
            blockly: 'fr'
        },
        */

        hideSaveOrLoad: false,
        actionDelay: 200,
        buttonScaleDrawing: false,

        includeBlocks: {
            groupByCategory: true,
            generatedBlocks: {
                database: [
                    'initHistogram',
                    'setHistogramBar'
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
            context.expectHistogram({
                // max_value: int or {min:.., max: ..} obj, optional
                /*
                max_value: 10,
                */
                /*
                max_value: {
                    min: 9,
                    max: 11
                },
                */

                // optional, check values if defined
                labels: [
                    'label1',
                    'label2',
                    'label3',
                    'label4',
                    'label5',
                ],

                // optional, check values if defined
                values: [
                    1,
                    2,
                    8,
                    5,
                    10
                ],

                // optional, check records order, false by default
                //check_order: true
            });
        },
        databaseConfig: {
            //disable_csv_import: true,
            //calculate_hash: true,
            //strict_types: true
        },
        startingExample: {
            easy: {
                blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="dpE`|BKIag-D}N/{9*SA" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="initHistogram" id="kfwlVB]rYZKNsA:CeM@*"><value name="PARAM_0"><shadow type="math_number" id="?x9XmFHV;ZBZ|Wi8T9v="><field name="NUM">5</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="`]B(Ko*_H=Cm+{cBmVe*"><field name="NUM">10</field></shadow></value><next><block type="setHistogramBar" id="k#U580=teqj[kf+p9220"><value name="PARAM_0"><shadow type="math_number" id="Qw*EH{u0KB*uMLa(eQBy"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="text" id=")=pHSx.,a9b*vshhGfAM"><field name="TEXT">label1</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="Zdd?Q-uL=_zr#Cg1Y,t*"><field name="NUM">1</field></shadow></value><next><block type="setHistogramBar" id=":j.cWpuCt8I{Hd*ZI1Q+"><value name="PARAM_0"><shadow type="math_number" id="T)Fg9}Hmf[Gx6kAJgRUf"><field name="NUM">1</field></shadow></value><value name="PARAM_1"><shadow type="text" id="{2q@+A0.V*J}dy,XXI,."><field name="TEXT">label2</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="M06w7~Thg`MxchcmXcyq"><field name="NUM">2</field></shadow></value><next><block type="setHistogramBar" id="8fy/()@D):RBxp;E8.me"><value name="PARAM_0"><shadow type="math_number" id="_V8[-riLJ8u]tX|Z|yFp"><field name="NUM">2</field></shadow></value><value name="PARAM_1"><shadow type="text" id="hrhg*Ex;ZB`3HkXQip8+"><field name="TEXT">label3</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id=";Tl?kLni2K-i:_3Q@c~a"><field name="NUM">8</field></shadow></value><next><block type="setHistogramBar" id="mN:yPK?4B-[R!B/9[RO!"><value name="PARAM_0"><shadow type="math_number" id="j`?V-`spIoLdhe?6VOa`"><field name="NUM">3</field></shadow></value><value name="PARAM_1"><shadow type="text" id="}k5hLZd:*26F[;o*,s_z"><field name="TEXT">label4</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="h4q8,#!leMR8t8B~.lwL"><field name="NUM">5</field></shadow></value><next><block type="setHistogramBar" id="9jE#[V*~4h)eBIvGNq,i"><value name="PARAM_0"><shadow type="math_number" id="l#txlV[TV2j9MmAA2:*E"><field name="NUM">4</field></shadow></value><value name="PARAM_1"><shadow type="text" id="xAx3edZdtVo#GkBLTqF5"><field name="TEXT">label5</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="j_X@:D(mu+~O;RCga@fv"><field name="NUM">555</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
            }
        }
    }




    subTask.data = {
        easy: [
            {}
        ]
    }
    initBlocklySubTask(subTask)
}
initWrapper(initTask, null, null)