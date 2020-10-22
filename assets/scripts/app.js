//code here
class DOMHelper {
    static moveElement(elementId, newDestinationSelector) {
        const element = document.getElementById(elementId);
        const destinationEl = document.querySelector(newDestinationSelector);
        destinationEl.append(element);
        element.scrollIntoView({
            behavior: "smooth"
        });
    }

    static clearEventListeners(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
}

//my
// class ExtraInfo {
//     constructor(infoText) {
//         this.infoText = infoText;
//     }
// }

class Component {
    constructor(hostElementId, insertBefore = false) {
        if (hostElementId) {
            this.hostElement = document.getElementById(hostElementId);
        } else {
            this.hostElement = document.body;
        }
        this.insertBefore = insertBefore;
    }

    detach() {
        if (this.element) {
            // this.element.remove();
            this.element.parentElement.removeChild(this.element);
        }
    }

    attach() {
        this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element);
    }
}

class Tooltip extends Component {
    constructor(closeNotifierFunction, text, hostElementId) {
        super(hostElementId);
        this.closeNotifier = closeNotifierFunction;
        this.text = text;
        this.create();
    }

    closeTooltip = () => {
        this.detach();
        this.closeNotifier();
    }

    create() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        const tooltipTemplate = document.getElementById('tooltip');
        const tooltipBody = document.importNode(tooltipTemplate.content, true);
        tooltipBody.querySelector('p').textContent = this.text;
        tooltipElement.append(tooltipBody);

        const  hostElPosLeft = this.hostElement.offsetLeft;
        const  hostElPosTop = this.hostElement.offsetTop;
        const  hostElHeight = this.hostElement.clientHeight;
        const  parentElScrolling = this.hostElement.parentElement.scrollTop;

        const x = hostElPosLeft + 20;
        const y = hostElPosTop + hostElHeight - parentElScrolling - 10;

        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = x + 'px';
        tooltipElement.style.top = y + 'px';

        tooltipElement.addEventListener('click', this.closeTooltip);
        this.element = tooltipElement;
    }

}

class ProjectItem {

    hasActiveTooltip = false;

    constructor(id, updateProjectListsFunction, type, extraInfo) {
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectSwitchButton(type);
        this.connectInfoButton(extraInfo);
    }

    //my solution
    // connectInfoButton(extraInfo) {
    //     const projectItemElement = document.getElementById(this.id);
    //     const moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
    //     moreInfoBtn.addEventListener('click', this.displayInfo.bind(this, extraInfo.infoText, projectItemElement));
    //
    // }

    // displayInfo(information, projectItemElement){
    //     const description = document.createElement('p');
    //     description.innerHTML = `<p>${information}</p>`;
    //     projectItemElement.appendChild(description);
    //     DOMHelper.clearEventListeners(projectItemElement.querySelector('button:first-of-type'));
    // }

    showMoreInfoHandler() {
        if (this.hasActiveTooltip) {
            return;
        }
        const projectElement = document.getElementById(this.id);
        const tooltipText = projectElement.dataset.extraInfo;
        const tooltip = new Tooltip(() => {
            this.hasActiveTooltip = false;
        },
            tooltipText,
            this.id
        );
        tooltip.attach();
        this.hasActiveTooltip = true;
    }

    connectInfoButton() {
        const projectItemElement = document.getElementById(this.id);
        const moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler.bind(this));

    }

    update(updateProjectListsFn, type) {
        this.updateProjectListsHandler = updateProjectListsFn;
        this.connectSwitchButton(type);
    }

    connectSwitchButton(type) {
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn);
        switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchBtn.addEventListener(
            'click',
            this.updateProjectListsHandler.bind(null, this.id)
        );
    }
}

class ProjectList {
    projects = [];

    //my soutiion
    // constructor(type) {
    //     this.type = type;
    //     const projItems = document.querySelectorAll(`#${type}-projects ul > li`);
    //     for (const projItem of projItems) {
    //         const info = new ExtraInfo(projItem.dataset.extraInfo)
    //         this.projects.push(new ProjectItem(projItem.id, this.switchProject.bind(this), this.type, info));
    //         // console.log(this);
    //     }
    // }

    constructor(type) {
        this.type = type;
        const projItems = document.querySelectorAll(`#${type}-projects ul > li`);
        for (const projItem of projItems) {
            this.projects.push(new ProjectItem(projItem.id, this.switchProject.bind(this), this.type));
        }
    }

    setSwitchHandlerFunction(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this), this.type);
    }

    switchProject(projectID) {
        // const projectIndex = this.#projects.findIndex(p => p.id === projectID);
        // this.#projects.splice(projectIndex, 1);
        this.switchHandler(this.projects.find(p => p.id === projectID));
        this.projects = this.projects.filter(p => p.id !== projectID);
    }

}

class App {
    static init() {
        const activeProjectsList = new ProjectList('active');
        const finishedProjectsList = new ProjectList('finished');
        activeProjectsList.setSwitchHandlerFunction(finishedProjectsList.addProject.bind(finishedProjectsList));
        finishedProjectsList.setSwitchHandlerFunction(activeProjectsList.addProject.bind(activeProjectsList));

        //Lets create a script dynamically with JS
        // const someScript = document.createElement('script');
        // someScript.textContent = 'alert("Hi there!")';
        // document.head.append(someScript);

        const timerId = setTimeout(this.startAnalytics, 3000);

        const stopAnalyticsBtn = document.getElementById('start-analytics-btn');
        stopAnalyticsBtn.addEventListener('click', () => {
            clearTimeout(timerId);
            console.log('stopped');
        });

    }

    static startAnalytics() {
        const analyticsScript = document.createElement('script');
        analyticsScript.src = "assets/scripts/analytics.js";
        analyticsScript.defer = true;
        document.head.append(analyticsScript);
    }

}

App.init();