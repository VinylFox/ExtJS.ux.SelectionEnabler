/**
 * @author Shea
 */

Ext.onReady(function(){

    var mywin;
    var button = Ext.get('show-btn');

    button.on('click', function(){
        // create the window on the first click and reuse on subsequent clicks
        if(!mywin){

            var showSlogan = function(){
                Ext.Msg.alert('State Slogan', mywin.stateGrid.getSelectionModel().getSelected().get('Slogan'));  
            };

            mywin = new Ext.Window({
                layout: 'border',
                title: 'SelectionEnabler Window',
                closeAction: 'hide',
                width:600,
                height:400,
                x: 40,
                y: 60,
                border: false,
                items: [{
                    xtype: 'grid',
                    region: 'west',
                    width: 350,
                    split: true,
                    ref: '../stateGrid',
                    store: new Ext.data.ArrayStore({
                        data: Ext.exampledata.states,
                        fields: ['Abbr','Name','Slogan']
                    }),
                    columns: [{
                        id: 'name', header: 'State Name', width: 100, dataIndex: 'Name'
                    }],
                    autoExpandColumn: 'name',
                    plugins: [new Ext.ux.SelectionEnabler({enablerGroup: 'stategrid'})],
                    bbar: ['Select a State to Continue','->',{
                        text: 'Delete',
                        enableOnSingle: 'stategrid',
                        disabled: true,
                        handler: function(){
                            var sel = mywin.stateGrid.getSelectionModel().getSelected();
                            mywin.stateGrid.getStore().remove(sel);
                        }
                    },{
                        text: 'Single',
                        enableOnSingle: 'stategrid',
                        disabled: true,
                        handler: showSlogan,
                        scope: this
                    },{
                        text: 'Multiple',
                        enableOnMultiple: 'stategrid',
                        disabled: true,
                        handler: showSlogan,
                        scope: this
                    },{
                        text: 'Both',
                        enableOnMultiple: 'stategrid',
                        enableOnSingle: 'stategrid',
                        disabled: true,
                        handler: showSlogan,
                        scope: this
                    }]
                },{
                    bodyStyle: 'padding: 10px;',
                    region: 'center',
                    html: 'I can be disabled an enabled, and that aint not bad!<br/><br/>A single selection will enable me, and a multiple or no selection at all will disable me.<br/><br/>Notice the overflowed buttons are disabled and enabled as well.<br/><br/>Anything within the same layout as the Component with the SelectionEnabler plugin will work.',
                    enableOnSingle: 'stategrid',
                    disabled: true
                }]
            });
            
        }
        
        mywin.show();
        
    });
    
 });