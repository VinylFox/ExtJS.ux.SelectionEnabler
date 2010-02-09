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
                layout: 'fit',
                title: 'SelectionEnabler Window',
                closeAction: 'hide',
                width:400,
                height:400,
                x: 40,
                y: 60,
                items: [{
                    xtype: 'grid',
                    border: false,
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
                }]
            });
            
        }
        
        mywin.show();
        
    });
    
 });