Ext.ns('Ext.ux');
/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class Ext.ux.SelectionEnabler
 * @extends Ext.Component
 * <p>A plugin that allows simple setup of activating and deactivating components within the same layout upon selection change.</p>
 */
Ext.ux.SelectionEnabler = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {String} enablerGroup
     * String representing the group name to look for when enabling or disabling components
     */
	// private
    init: function(cmp){
        this.ownerCt = cmp;
        // the tree selection model does not have a rowselect event, so we have to use selectionchange - bleh!
        if (!this.ownerCt.getSelectionModel().getCount) {
            this.ownerCt.getSelectionModel().on('selectionchange', this.enablerSelectionChange, this);
        }else{
            this.ownerCt.getSelectionModel().on('rowselect', this.enablerSelectionChange, this);
            this.ownerCt.getStore().on('remove', this.enablerSelectionRemoved, this);
            this.ownerCt.getStore().on('load', this.enablerDisableAll, this);
        }
    },
    // private
    enablerDisableAll: function(){
        
        var allBtns = this.getAllButtons();
        
        Ext.each(allBtns, function(cmp){
            if (cmp.disable) {
                if (cmp.enableOnSingle === this.enablerGroup || cmp.enableOnMultiple === this.enablerGroup) {
                    cmp.disable();
                }
            }
        }, this);
        
        allBtns = this.getAllFamilyPanels();
        
        Ext.each(allBtns, function(cmp){
            if (cmp.disable) {
                if (cmp.enableOnSingle === this.enablerGroup || cmp.enableOnMultiple === this.enablerGroup) {
                    cmp.disable();
                }
            }
        }, this);
        
    },
    // private
    enablerSelectionRemoved: function(sm){
        
        var allBtns = this.getAllButtons();
        
        Ext.each(allBtns, function(cmp){
            if (cmp.enableOnSingle === this.enablerGroup || cmp.enableOnMultiple === this.enablerGroup) {
                cmp.disable();
            }
        }, this);
        
        allBtns = this.getAllFamilyPanels();
        
        Ext.each(allBtns, function(cmp){
            if (cmp.enableOnSingle === this.enablerGroup || cmp.enableOnMultiple === this.enablerGroup) {
                cmp.disable();
            }
        }, this);
        
    },
	// private
    enablerSelectionChange: function(sm){
        
        if (sm.hasSelection){
            if (!sm.hasSelection()){
                return true;
            }
        }
        
        var cnt = 1, sel;
        if (sm.getCount){
            // probably a grid
            cnt = this.ownerCt.getSelectionModel().getCount();
            sel = this.ownerCt.getSelectionModel().getSelected();
            if (this.fieldValuePresent){
                if (!sel.get(this.fieldValuePresent)){
                    return true;
                }
            }
        }else if (sm.getSelectedNode){
            // probably a single selection tree
            cnt = 1;
            sel = sm.getSelectedNode();
            if (Ext.isObject(sel)) {
                if (this.fieldValuePresent) {
                    if (sel && !sel.attributes[this.fieldValuePresent]) {
                        return true;
                    }
                }
                if (sel.id === 'root') {
                    return true;
                }
            }
        }else if (sm.getSelectedNodes){
            // probably a multiple selection tree
            cnt = sm.getSelectedNodes().length;
            sel = sm.getSelectedNodes()[0];
            if (this.fieldValuePresent){
                if (sel && !sel.attributes[this.fieldValuePresent]){
                    return true;
                }
            }
        }else{
            // who knows what this is - fail! (gently)
            return true;
        }
        
        this.enableComponents(sm.singleSelect, cnt, this.getAllButtons());
        this.enableComponents(sm.singleSelect, cnt, this.getAllFamilyPanels());
        
    },
    // private
    enableComponents: function(ss, ns, allCmps){
        
        var done = false;

        Ext.each(allCmps, function(cmp){
            if (cmp.disable) {
                if (cmp.enableOnSingle === this.enablerGroup) {
                    if (ns === 1) {
                        cmp.enable();
                        done = true;
                    }
                    if (ns > 1) {
                        cmp.disable();
                    }
                }
                if (!done) {
                    if (!ss && cmp.enableOnMultiple === this.enablerGroup) {
                        if (ns > 1) {
                            cmp.enable();
                        }
                        if (ns === 1) {
                            cmp.disable();
                        }
                    }
                }
            }
        }, this);
        
    },
    // private
    getAllButtons: function(){
        
        var allBtns = [];
        
        if (this.ownerCt.bbar){
            Ext.each(this.ownerCt.getBottomToolbar().items.items, function(b){ allBtns.push(b); });
        }
        if (this.ownerCt.tbar) {
            Ext.each(this.ownerCt.getTopToolbar().items.items, function(b){ allBtns.push(b); });
        }
        if (this.ownerCt.buttons){
            Ext.each(this.ownerCt.buttons, function(b){ allBtns.push(b); });
        }
        
        return allBtns;
        
    },
    // private
    getAllFamilyPanels: function(){
        
        this.familyPanels = [];
        
		if (this.ownerCt.ownerCt) {
			Ext.each(this.ownerCt.ownerCt.items.items, function(cmp){
			
				if (cmp.enableOnSingle || cmp.enableOnMultiple) {
					this.familyPanels.push(cmp);
				}
				
				if (cmp.items) {
					Ext.each(cmp.items.items, this.getNestedFamilyPanels, this);
				}
				
			}, this);
		}
		
        return this.familyPanels;
        
    },
    // private
    getNestedFamilyPanels: function(region){
        
        if (region.enableOnSingle || region.enableOnMultiple) {
            this.familyPanels.push(region);
        }
        
        if (region.items) {
            Ext.each(region.items.items, this.getNestedFamilyPanels, this);
        }
        
    }
    
});