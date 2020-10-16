function initTask(subTask) {

    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 200,
        buttonScaleDrawing: false,
        //conceptViewer: true,

        includeBlocks: {
            groupByCategory: false,
            generatedBlocks: {
                map: [
                    'addCity',
                    'getNbCities',
                    'addRoad',
                    'getNbRoads',
                    'getCityRoads',
                    'getCityLongitude',
                    'getCityLatitude',
                    'getRoadLength',
                    'highlightRoad',
                    'getDestinationCity',
                    'echo'
                ]
            },
            standardBlocks: {
                includeAll: false
            }
        },
        maxInstructions: 100,
        checkEndEveryTurn: false,
        mapConfig: {
            map_lng_left: -4.85,
            map_lng_right: 9.65,
            map_lat_top: 51.6,
            map_lat_bottom: 41.7,            
            // map2d options
            pin_file: 'img/pin.png',
            map_file: 'img/carteDeFrance.png',
            truncate_labels: false
        },
        mapValidData: {
            cities: [
                { lng: 2.35392, lat: 48.855815, name: "Paris" },
                { lng: -4.486885, lat: 48.392168, name: "Brest" },
                { lng: 7.269332, lat: 43.950121, name: "Nice" }
            ],
            roads: [
                { city_idx_1: 0, city_idx_2: 1, highlighted: true },
                { city_idx_1: 0, city_idx_2: 2, highlighted: false }
            ]
        },

        startingExample: {
            easy: {
                blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="8G+*bc)aNrkhvq(RZ{MH" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="addCity" id="S#Os:LRxxB/nTE~ItL:o"><value name="PARAM_0"><shadow type="math_number" id="U|8=ghh7cn0|DjIae6te"><field name="NUM">2.35392</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="5FC!RQsjY|]thgHJ,kfa"><field name="NUM">48.855815</field></shadow></value><value name="PARAM_2"><shadow type="text" id=")}j:RADJZ!xSy-f~S7ME"><field name="TEXT">Paris</field></shadow></value><next><block type="addCity" id="XZBIq183r3P`g]gAxvBL"><value name="PARAM_0"><shadow type="math_number" id="9YX?|1SAGVpvFAfdXN[*"><field name="NUM">-4.486885</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="QE{k3dqj7R@Of4ajB+W3"><field name="NUM">48.392168</field></shadow></value><value name="PARAM_2"><shadow type="text" id="5-c63{N?Gi0/PrV;0K_U"><field name="TEXT">Brest</field></shadow></value><next><block type="addCity" id="I~K5*QZdK/hpTu0Fd/P:"><value name="PARAM_0"><shadow type="math_number" id="q39JxNEY61P612U2N]Z6"><field name="NUM">7.269332</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="+i{Q.dxT5UMHO!,x7z=4"><field name="NUM">43.950121</field></shadow></value><value name="PARAM_2"><shadow type="text" id="h-y=,JRyZ4~/4J0;,H2B"><field name="TEXT">Nice</field></shadow></value><next><block type="addRoad" id="s),Uw1R0dUd3Yd6Zy{kY"><value name="PARAM_0"><shadow type="math_number" id="SG*vjl7wTawX60R6(l/a"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="KC{LYi#h)}xqc*+8ir6H"><field name="NUM">1</field></shadow></value><next><block type="addRoad" id=",fXlzo=]:kW.eNfQp=8:"><value name="PARAM_0"><shadow type="math_number" id="|E5W4Ftf_zsf2pUJC)DA"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="_/.KZmuMZMLj342/Mlk1"><field name="NUM">2</field></shadow></value><next><block type="highlightRoad" id="f`8J/T+6T.4N/*6o@1PS"><value name="PARAM_0"><shadow type="math_number" id="5A9*4V9RmHqTlnER6jv6"><field name="NUM">0</field></shadow></value><next><block type="echo" id="~~!T0B!lm@*tSy4_lpS@"><value name="PARAM_0"><shadow type="text" id="ROrLB)IQ+46{f{hTCBI4"><field name="TEXT"></field></shadow><block type="getNbRoads" id="wx(.G7BpZ#8A3=O,mV|0"><value name="PARAM_0"><shadow type="math_number" id="4ba{~RPyLdap}5@3IYgI"><field name="NUM">0</field></shadow></value></block></value><next><block type="echo" id="!W89(RG~[MWg:xzr)bhd"><value name="PARAM_0"><shadow type="text" id="ROrLB)IQ+46{f{hTCBI4"><field name="TEXT"></field></shadow><block type="getCityRoads" id="i9J,tgFkw7BtHK|3=WPY"><value name="PARAM_0"><shadow type="math_number" id="@Iz{hM{)4UBgSe5K.(G("><field name="NUM">0</field></shadow></value></block></value><next><block type="echo" id="8x!K;Ncy3uLemtE#OoCJ"><value name="PARAM_0"><shadow type="text" id="ROrLB)IQ+46{f{hTCBI4"><field name="TEXT"></field></shadow><block type="getRoadLength" id="h8}Yp,EJ2v|]~NiO5)0,"><value name="PARAM_0"><shadow type="math_number" id="l=*26~3zA/AZoG:;_r7E"><field name="NUM">0</field></shadow></value></block></value><next><block type="echo" id="m_QxMHQ+wO8;(3l=/u|_"><value name="PARAM_0"><shadow type="text" id="ROrLB)IQ+46{f{hTCBI4"><field name="TEXT"></field></shadow><block type="getDestinationCity" id="SXrW{k1_MHuewQ*)Dg-)"><value name="PARAM_0"><shadow type="math_number" id="#z71D`-(Me8uu[_!N5[J"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="~uP;E5w37+g_L4RxRx]h"><field name="NUM">1</field></shadow></value></block></value><next><block type="echo" id="bm|FCs[*aM[m@?(GJU4O"><value name="PARAM_0"><shadow type="text" id="ROrLB)IQ+46{f{hTCBI4"><field name="TEXT"></field></shadow><block type="getCityLongitude" id="1pXUS{PZBgSugvva3Z:-"><value name="PARAM_0"><shadow type="math_number" id="K[4WF3K]R3novr[zJp5k"><field name="NUM">0</field></shadow></value></block></value><next><block type="echo" id="I0537kwuotsX!UMqshPc"><value name="PARAM_0"><shadow type="text" id="ROrLB)IQ+46{f{hTCBI4"><field name="TEXT"></field></shadow><block type="getCityLatitude" id="/f#9ZXgdbDhkZaaJn2VY"><value name="PARAM_0"><shadow type="math_number" id="W)ASK}-blAP?1VBIbmRv"><field name="NUM">0</field></shadow></value></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
            }
        }
    }

    subTask.data = {
        easy: [{}]
    }
    initBlocklySubTask(subTask)
}
initWrapper(initTask, null, null)
