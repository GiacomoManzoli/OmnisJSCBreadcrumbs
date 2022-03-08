export declare type Breadcrumb = { label: string, position: number }
declare type BreadcrumbsEvent = "click"
declare type BreadcrumbsEventHandler = (event: Event, index: number) => void

import "./style.css"


export class Breadcrumbs {
    breadcrumbs: Breadcrumb[]
    container: HTMLElement
    handlers: Map<BreadcrumbsEvent, BreadcrumbsEventHandler>

    renderedCrumbs: Map<number, { crumb: Breadcrumb; li: HTMLLIElement }> = new Map()

    backgroundColor: string

    crumbspacing = 8
    crumbwidth: number = 160
    crumbminwidth: number = 0
    crumbmaxwidth: number = 0
    crumbpaddinghorz: number = 8
    crumbpaddingvert: number = 8

    iconElement?: HTMLElement = null
    iconColor: string
    textColor: string

    constructor(container: HTMLElement) {

        this.breadcrumbs = []
        this.container = container
        container.classList.add("my-tabstrip")
        this.handlers = new Map()
    }


    setBreadcrumbs(crumns: Breadcrumb[]) {
        this.breadcrumbs = [...crumns]
    }


    addEventListener(evName: BreadcrumbsEvent, callback: BreadcrumbsEventHandler) {
        this.handlers.set(evName, callback)
    }



    private onTabClick(event: MouseEvent, index: number) {
        const button = event.currentTarget as HTMLElement

        console.log("button")

        const circle = document.createElement("span")
        const diameter = Math.max(button.clientWidth, button.clientHeight)
        const radius = diameter / 2
        circle.style.width = circle.style.height = `${diameter}px`
        circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`
        circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`
        circle.classList.add("crumb-ripple")
        const ripple = button.getElementsByClassName("crumb-ripple")[0]
        if (ripple) {
            ripple.remove()
        }
        button.appendChild(circle)

        event.preventDefault()
        event.stopPropagation()
        const handler = this.handlers.get("click")
        if (handler) {
            handler(event, index)
        }
    }


    render(): void {
        let ul: HTMLElement
        if (this.container.innerHTML == "") {
            ul = document.createElement("ul")
            ul.classList.add("my-breadcrums-ul")
            ul.style.backgroundColor = this.backgroundColor
            ul.style.color = this.textColor
            this.container.appendChild(ul)
        } else {
            ul = this.container.querySelector("ul")
        }

        // Inserts/updates
        for (let index = this.breadcrumbs.length - 1; index >= 0; index--) {

            let currCrumb = this.breadcrumbs[index]
            if (this.renderedCrumbs.has(index)) {
                let { crumb, li } = this.renderedCrumbs.get(index)


                this.updateItem(li, currCrumb, index)
                this.renderedCrumbs.set(index, { crumb: currCrumb, li })

            } else {
                let li = this.createItem(currCrumb, index)
                this.renderedCrumbs.set(index, { crumb: currCrumb, li })

                if (index == 0) {
                    // First item
                    ul.insertBefore(li, ul.firstChild)
                } else if (index == this.breadcrumbs.length - 1) {
                    // Last item
                    ul.appendChild(li)
                } else {
                    let nextCrumbIndex = index + 1
                    let nextCrumbLi = this.renderedCrumbs.get(nextCrumbIndex).li
                    ul.insertBefore(li, nextCrumbLi)
                }
            }
        }

        // Deletes
        let realTabsId = new Set(this.breadcrumbs.map((t) => t.position))
        this.renderedCrumbs.forEach((v) => {

            if (!realTabsId.has(v.crumb.position)) {
                ul.removeChild(v.li)
                this.renderedCrumbs.delete(v.crumb.position)
            }
        })

        // this.tabs.map((tab, index) => this.createItem(tab, index)).forEach((li) => ul.appendChild(li))
    }

    private createItem(crumb: Breadcrumb, index: number) {
        let li: HTMLLIElement
        li = this.createCrumb(crumb, index)
        return li
    }



    private createCrumb(crumb: Breadcrumb, index: number) {
        // Container
        const li = document.createElement("li")
        li.style.backgroundColor = this.backgroundColor
        li.classList.add("my-breadcrumbs-crumb-container")

        const content = document.createElement("span")
        content.classList.add("my-breadcrumbs-crumb-content")


        // CSS ripple
        content.style.position = "relative"
        content.style.overflow = "hidden"

        // Tab size
        content.style.padding = `${this.crumbpaddingvert}px ${this.crumbpaddinghorz}px`
        if (this.crumbwidth > 0) {
            content.style.width = `${this.crumbwidth}px`
        } else {
            content.style.minWidth = `${this.crumbminwidth}px`
            content.style.maxWidth = `${this.crumbmaxwidth}px`
        }


        const a = document.createElement("a")
        a.classList.add("my-breadcrumbs-crumb-content")



        li.append(content)
        content.append(a)

        let icon: HTMLElement
        if (this.iconElement) {
            icon = this.iconElement.cloneNode(true) as HTMLElement
            icon.style.setProperty("--om-tint-color", this.iconColor)
        } else {
            icon = document.createElement("i")
            icon.classList.add("chevron")
            icon.classList.add("right")

            icon.style.borderColor = this.iconColor
        }

        icon.style.margin = ` 0 ${this.crumbspacing}px`

        li.append(icon)
        this.updateItem(li, crumb, index)
        return li
    }

    private updateItem(li: HTMLLIElement, crumb: Breadcrumb, index: number) {
        console.log("update item", crumb, li, this.textColor)
        // Spacing between tabs
        if (index > 0) {

        }

        const a = li.querySelector("a")
        a.innerText = crumb.label
        li.style.backgroundColor = this.backgroundColor
        li.style.color = this.textColor
        li.style.boxShadow = ""

        const content: HTMLElement = li.querySelector(".my-breadcrumbs-crumb-content")
        if (content) {
            content.onclick = (event) => {
                this.onTabClick(event, crumb.position)
            }
        }


    }


}
