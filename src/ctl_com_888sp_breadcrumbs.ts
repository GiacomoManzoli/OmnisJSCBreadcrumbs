import { Breadcrumbs, Breadcrumb } from "./Breadcrumbs"

// import "./style.css"
/****** CONSTANTS ******/
var PROPERTIES = {
    // <OmnisUpdateMarker_PropertyConstants_Begin>
    backgroundcolor: "$backgroundcolor",
    textcolor: "$textcolor",
    crumbspacing: "$crumbspacing",
    crumbminwidth: "$crumbminwidth",
    crumbmaxwidth: "$crumbmaxwidth",
    crumbwidth: "$crumbwidth",
    crumbpaddinghorz: "$crumbpaddinghorz",
    crumbpaddingvert: "$crumbpaddingvert",

    dividericonid: "$dividericonid",
    dividericoncolor: "$dividericoncolor"
    // <OmnisUpdateMarker_PropertyConstants_End>
}

var EVENTS = {
    evBreadcrumbClick: 1
}

export class ctrl_com_888sp_breadcrumbs extends ctrl_base {
    breadcrumbsCtrl: Breadcrumbs

    props: Map<string | number, any> = new Map()

    constructor() {
        super()
        this.init_class_inst() // initialize our class
    }

    init_ctrl_inst(form, elem, rowCtrl, rowNumber) {
        super.init_ctrl_inst(form, elem, rowCtrl, rowNumber)

        var client_elem = this.getClientElem()

        var datapropsobj = JSON.parse(client_elem.getAttribute("data-props"))

        this.initBreadcrumb(client_elem)


        for (let propName in PROPERTIES) {
            const propValue = datapropsobj[propName] // L'oggetto è indicizzato per il nome senza $
            this.setProperty(PROPERTIES[propName], propValue)
        }

        this.update()

        return false
    }

    updateCtrl(what, row, col, mustUpdate) {
        var elem = this.getClientElem()
        // center the text vertically:
        elem.style.lineHeight = elem.style.height
        elem.style.textAlign = "center"

        // read $dataname value and display in control
        const dataname = this.getData()
        const datanameList = new omnis_list(dataname)

        this.mData = dataname

        if (dataname) {
            let crumbs: Breadcrumb[] = []
            for (let index = 1; index <= datanameList.getRowCount(); index++) {
                crumbs.push({
                    position: index,
                    label: datanameList.getData("label", index),
                })
            }
            this.breadcrumbsCtrl.setBreadcrumbs(crumbs)
            this.breadcrumbsCtrl.render()
        } else {
            elem.innerHTML = "com.888sp.breadcrumbs"
        }
    }

    /**
     * This is called when an event registered using this.mEventFunction() is triggered.
     *
     * @param event The event object
     */
    handleEvent(event: any) {
        if (!this.isEnabled()) return true // If the control is disabled, don't process the event.

        switch (event.type) {
            case "click":
                return true
        }

        super.handleEvent(event)
    }

    getCanAssign(propNumber: number | string) {
        return Object.values(PROPERTIES).includes(propNumber.toString()) || super.getCanAssign(propNumber)
    }

    setProperty(propNumber: number | string, propValue: any) {
        if (!this.getCanAssign(propNumber)) {
            return false
        }

        if (propNumber) {

            this.props.set(propNumber, propValue)

            switch (propNumber) {
                // Main control
                case PROPERTIES.backgroundcolor:
                    let backColorCSS = this.getTheme().getColorString(propValue)
                    this.breadcrumbsCtrl.backgroundColor = backColorCSS
                    return true
                case PROPERTIES.textcolor:
                    let textColorCSS = this.getTheme().getColorString(propValue)
                    this.breadcrumbsCtrl.textColor = textColorCSS
                    return true
                case PROPERTIES.crumbspacing:
                    this.breadcrumbsCtrl.crumbspacing = propValue as number
                    return true
                case PROPERTIES.crumbwidth:
                    this.breadcrumbsCtrl.crumbwidth = propValue as number
                    return true
                case PROPERTIES.crumbmaxwidth:
                    this.breadcrumbsCtrl.crumbmaxwidth = propValue as number
                    return true
                case PROPERTIES.crumbminwidth:
                    this.breadcrumbsCtrl.crumbminwidth = propValue as number
                    return true
                case PROPERTIES.crumbpaddinghorz:
                    this.breadcrumbsCtrl.crumbpaddinghorz = propValue as number
                    return true
                case PROPERTIES.crumbpaddingvert:
                    this.breadcrumbsCtrl.crumbpaddingvert = propValue as number
                    return true
                case PROPERTIES.dividericonid:
                    let placeholder = document.createElement("i")
                    let iconElement = jIcons.replaceOrAddToElem(placeholder, propValue, null, null)
                    this.breadcrumbsCtrl.iconElement = iconElement
                case PROPERTIES.dividericoncolor:
                    let iconColorCSS = this.getTheme().getColorString(propValue)
                    this.breadcrumbsCtrl.iconColor = iconColorCSS
                    return true
            }
        }

        return super.setProperty(propNumber, propValue)
    }

    getProperty(propNumber: string | number) {
        switch (propNumber) {
            // Main control
            case PROPERTIES.backgroundcolor:
                return this.breadcrumbsCtrl.backgroundColor

            case PROPERTIES.textcolor:
                return this.breadcrumbsCtrl.textColor

            case PROPERTIES.crumbspacing:
                return this.breadcrumbsCtrl.crumbspacing
            case PROPERTIES.crumbwidth:
                return this.breadcrumbsCtrl.crumbwidth
            case PROPERTIES.crumbmaxwidth:
                return this.breadcrumbsCtrl.crumbmaxwidth
            case PROPERTIES.crumbminwidth:
                return this.breadcrumbsCtrl.crumbminwidth
            case PROPERTIES.crumbpaddinghorz:
                return this.breadcrumbsCtrl.crumbpaddinghorz
            case PROPERTIES.crumbpaddingvert:
                return this.breadcrumbsCtrl.crumbpaddingvert

            case PROPERTIES.dividericonid, PROPERTIES.dividericoncolor:
                return this.props.get(propNumber)


        }

        return super.getProperty(propNumber)
    }

    private initBreadcrumb(client_elem) {
        this.breadcrumbsCtrl = new Breadcrumbs(client_elem)

        this.breadcrumbsCtrl.addEventListener("click", (event, position) => {

            if (this.canSendEvent(EVENTS.evBreadcrumbClick)) {
                this.eventParamsAdd("pNum", position)
                this.sendEvent("evBreadcrumbClick")
            }
        })


    }

}

