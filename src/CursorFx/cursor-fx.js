const SIZE_DEFAULT = 32
    , SIZE_HOVER = 62
    , SIZE_HORIZONTAL = 62
    , BORDER_WIDTH = 2
    , lerp = (
        a,
        b,
        n,
    ) => ( ( 1 - n ) * a + n * b )
    , getMousePos = e => {

        let posx = 0
            , posy = 0
        ;

        if( ! e )
            e = window.event;

        if( e.pageX || e.pageY ) {

            posx = e.pageX;
            posy = e.pageY;

        } else if( e.clientX || e.clientY ) {

            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;

        }

        return {
            x: posx,
            y: posy,
        };

    }
;

export default class CursorFx {
    constructor(
        {
            el,
            base_class,
        },
        options = {},
    ) {

        this.DOM = {
            el,
        };
        this.$options = Object.freeze(
            {
                mixBlendMode: null,
                lerps: {
                    dot: 1,
                    circle: 0.18,
                    horizontalArrows: 0.8,
                    custom: 0.23,
                },
                size: {
                    ratio: 0.05,
                    default: SIZE_DEFAULT,
                    hover: SIZE_HOVER,
                },
                borderWidth: BORDER_WIDTH,
                opacity: 0.1,
                customColor: null,
                ... options,
            },
        );

        this.DOM.dot = this.DOM.el.querySelector(
            `${ base_class }__inner__inside`,
        );
        this.DOM.circle = this.DOM.el.querySelector(
            `${ base_class }__inner__outside`,
        );
        this.DOM.horizontalArrows = this.DOM.el.querySelector(
            `${ base_class }__inner__horizontal`,
        );
        this.DOM.oval = this.DOM.el.querySelector(
            `${ base_class }__inner__outside__oval`,
        );
        this.DOM.custom = this.DOM.el.querySelector(
            `${ base_class }__inner__custom`,
        );

        this.dragging = false;
        this.horizontal = false;
        this.horizontalDraging = false;

        this.bounds = {
            dot: this.DOM.dot ? this.DOM.dot.getBoundingClientRect() : null,
            circle: this.DOM.circle ? this.DOM.circle.getBoundingClientRect() : null,
            custom: this.DOM.custom ? this.DOM.custom.getBoundingClientRect() : null,
            horizontalArrows: this.DOM.horizontalArrows ? this.DOM.horizontalArrows.getBoundingClientRect() : null,
            snap: this.DOM.snap ? this.DOM.snap.getBoundingClientRect() : null,
            dragger: this.DOM.snap ? this.DOM.snap.getBoundingClientRect() : null,
        };

        if( this.bounds.dot && ! this.bounds.dot.width ) {

            const COMPUTED_STYLES = window.getComputedStyle(
                this.DOM.dot,
            );

            this.bounds.dot.width = parseInt(
                COMPUTED_STYLES
                    .getPropertyValue(
                        'width',
                    )
                    .replace(
                        'px',
                        '',
                    ),
                )
            ;
            this.bounds.dot.height = parseInt(
                COMPUTED_STYLES
                    .getPropertyValue(
                        'height',
                    )
                    .replace(
                        'px',
                        '',
                    ),
                )
            ;

        }

        if( this.bounds.circle && ! this.bounds.circle.width ) {

            const COMPUTED_STYLES = window.getComputedStyle(
                this.DOM.circle,
            );

            this.bounds.circle.width = parseInt(
                COMPUTED_STYLES
                    .getPropertyValue(
                        'width',
                    )
                    .replace(
                        'px',
                        '',
                    ),
                )
            ;
            this.bounds.circle.height = parseInt(
                COMPUTED_STYLES
                    .getPropertyValue(
                        'height',
                    )
                    .replace(
                        'px',
                        '',
                    ),
                )
            ;

        }

        if( this.bounds.custom && ! this.bounds.custom.width ) {

            const COMPUTED_STYLES = window.getComputedStyle(
                this.DOM.custom,
            );

            this.bounds.custom.width = parseInt(
                COMPUTED_STYLES
                    .getPropertyValue(
                        'width',
                    )
                    .replace(
                        'px',
                        '',
                    ),
                )
            ;
            this.bounds.custom.height = parseInt(
                COMPUTED_STYLES
                    .getPropertyValue(
                        'height',
                    )
                    .replace(
                        'px',
                        '',
                    ),
                )
            ;

        }

        this.size = this.$options.size.default;
        this.lastSize = this.$options.size.hover;
        this.opacity = this.$options.opacity;
        this.lastOpacity = 1;

        this.mousePos = {
            x: 0,
            y: 0,
        };
        this.lastMousePos = {
            dot: (
                this.DOM.dot
                ? this.DOM.dot.getBoundingClientRect()
                : {
                    top: 0,
                    left: 0,
                }
            ),
            horizontalArrows: (
                this.DOM.horizontalArrows
                ? this.DOM.horizontalArrows.getBoundingClientRect()
                : {
                    top: 0,
                    left: 0,
                }
            ),
            custom: (
                this.DOM.custom
                ? this.DOM.custom.getBoundingClientRect()
                : {
                    top: 0,
                    left: 0,
                }
            ),
            circle: (
                this.DOM.circle
                ? this.DOM.circle.getBoundingClientRect()
                : {
                    top: 0,
                    left: 0,
                }
            ),
        };

        this.initEvents();

        this.DOM.snap = null;

        requestAnimationFrame(
            () => this.render(),
        );

    }

    setMouseMove(
        ev,
    ) {

        this.mousePos = getMousePos(
            ev,
        );

    }

    initEvents() {

        const mouseMove = ev => this.setMouseMove(
            ev,
        );

        window.removeEventListener(
            'mousemove',
            mouseMove,
        );

        window.addEventListener(
            'mousemove',
            mouseMove,
            false,
        );

    }

    render() {

        requestAnimationFrame(
            () => this.render(),
        );

        const {
            lerps: {
                dot,
                circle,
                custom,
                horizontalArrows,
            },
            size: { ratio },
            opacity,
        } = this.$options;

        this.lastSize = lerp(
            this.lastSize,
            this.size,
            ratio,
        );
        this.lastOpacity = lerp(
            this.lastOpacity,
            this.opacity,
            opacity,
        );

        if( this.bounds.dot && ! this.dragging ) {

            this.lastMousePos.dot.x = lerp(
                this.lastMousePos.dot.x,
                this.mousePos.x - ( this.bounds.dot.width / 4 ),
                dot,
            );
            this.lastMousePos.dot.y = lerp(
                this.lastMousePos.dot.y,
                this.mousePos.y - ( this.bounds.dot.height / 4 ),
                dot,
            );

            this.DOM.dot.style.transform = `translateX(${ ( this.lastMousePos.dot.x ) }px) translateY(${ this.lastMousePos.dot.y }px)`;

        }

        if( this.bounds.circle ) {

            if( this.DOM.snap ) {

                this.bounds.snap = this.DOM.snap.getBoundingClientRect();
                this.bounds.circle = this.DOM.circle.getBoundingClientRect();

                this.DOM.oval.style.width = `${ this.bounds.snap.width }px`;
                this.DOM.oval.style.height = `${ this.bounds.snap.width }px`;

                this.lastMousePos.circle.x = lerp(
                    this.lastMousePos.circle.x,
                    this.bounds.snap.x - ( this.bounds.circle.width / 2 ) + ( this.bounds.snap.width / 2 ),
                    circle,
                );
                this.lastMousePos.circle.y = lerp(
                    this.lastMousePos.circle.y,
                    this.bounds.snap.y - ( this.bounds.circle.height / 2 ) + ( this.bounds.snap.height / 2 ),
                    circle,
                );

            } else if( this.DOM.dragger ) {

                this.bounds.dragger = this.DOM.dragger.getBoundingClientRect();
                this.bounds.circle = this.DOM.circle.getBoundingClientRect();

                this.DOM.oval.style.width = `${ this.bounds.dragger.width * 0.65 }px`;
                this.DOM.oval.style.height = `${ this.bounds.dragger.width * 0.65 }px`;

                this.lastMousePos.circle.x = lerp(
                    this.lastMousePos.circle.x,
                    this.bounds.dragger.x - ( this.bounds.circle.width / 2 ) + ( this.bounds.dragger.width / 2 ),
                    circle,
                );
                this.lastMousePos.circle.y = lerp(
                    this.lastMousePos.circle.y,
                    this.bounds.dragger.y - ( this.bounds.circle.height / 2 ) + ( this.bounds.dragger.height / 2 ),
                    circle,
                );

                if( this.dragging ) {

                    if( this.bounds.dot ) {

                        this.lastMousePos.dot.x = lerp(
                            this.lastMousePos.dot.x,
                            this.bounds.dragger.x + ( this.bounds.dragger.width * 0.5 ) - ( this.bounds.dot.width / 2 ),
                            1,
                        );
                        this.lastMousePos.dot.y = lerp(
                            this.lastMousePos.dot.y,
                            this.bounds.dragger.y + ( this.bounds.dragger.height * 0.5 ) - ( this.bounds.dot.height / 2 ),
                            1,
                        );

                        this.DOM.dot.style.transform = `translateX(${ ( this.lastMousePos.dot.x ) }px) translateY(${ this.lastMousePos.dot.y }px)`;

                    }

                }

            } else {

                this.DOM.oval.style.width = `${ this.size }px`;
                this.DOM.oval.style.height = `${ this.size }px`;

                this.bounds.circle = this.DOM.circle.getBoundingClientRect();
                this.bounds.horizontalArrows = this.DOM.horizontalArrows.getBoundingClientRect();

                this.lastMousePos.circle.x = lerp(
                    this.lastMousePos.circle.x,
                    this.mousePos.x - ( this.bounds.circle.width / 2 ) + ( this.$options.borderWidth / 2 ),
                    ! this.horizontalDragging ? circle : horizontalArrows
                );
                this.lastMousePos.circle.y = lerp(
                    this.lastMousePos.circle.y,
                    this.mousePos.y - ( this.bounds.circle.height / 2 ) + ( this.$options.borderWidth / 2 ),
                    ! this.horizontalDragging ? circle : horizontalArrows
                );

}


            this.bounds.horizontalArrows = this.DOM.horizontalArrows.getBoundingClientRect();

            this.lastMousePos.horizontalArrows.x = lerp(
                this.lastMousePos.horizontalArrows.x,
                this.mousePos.x - ( this.bounds.horizontalArrows.width / 2 ) + ( this.$options.borderWidth / 2 ),
                horizontalArrows,
            );
            this.lastMousePos.horizontalArrows.y = lerp(
                this.lastMousePos.horizontalArrows.y,
                this.mousePos.y - ( this.bounds.horizontalArrows.height / 2 ) + ( this.$options.borderWidth / 2 ),
                horizontalArrows,
            );

            this.DOM.circle.style.transform = `translateX(${ ( this.lastMousePos.circle.x ) }px) translateY(${ this.lastMousePos.circle.y }px)`;
            this.DOM.horizontalArrows.style.transform = `translateX(${ ( this.lastMousePos.horizontalArrows.x ) }px) translateY(${ this.lastMousePos.horizontalArrows.y }px)`;

        }

        if( this.bounds.custom ) {

            this.lastMousePos.custom.x = lerp(
                this.lastMousePos.custom.x,
                this.mousePos.x - ( this.bounds.custom.width / 2 ),
                custom,
            );
            this.lastMousePos.custom.y = lerp(
                this.lastMousePos.custom.y,
                this.mousePos.y - ( this.bounds.custom.height / 2 ),
                custom,
            );

            this.DOM.custom.style.transform = `translateX(${ ( this.lastMousePos.custom.x ) }px) translateY(${ this.lastMousePos.custom.y }px)`;

        }

    }

    enter(
        size = this.$options.size.hover,
    ) {

        this.size = size;

    }

    leave(
        size = this.$options.size.default,
    ) {

        this.size = size;

    }

    snap(
        link
    ) {

        this.DOM.snap = link;

    }

    release(
        link
    ) {

        this.DOM.snap = null;

    }

    dragStart(
        link
    ) {

        this.DOM.dragger = link;
        this.dragging = true;
        this.DOM.circle.style.opacity = `0`;

    }

    dragEnd(
        link
    ) {

        this.DOM.dragger = null;
        this.dragging = false;
        this.DOM.circle.style.opacity = `1`;

    }

    dragEnter(
        link
    ) {

        this.DOM.dragger = link;

    }

    dragLeave(
        link
    ) {

        this.DOM.dragger = null;

    }

    click(
        size = this.$options.size.hover,
        opacity = 0,
    ) {

        this.lastSize = size;
        this.lastOpacity = opacity;

    }

    enterHidden() {

        this.DOM.el.style.visibility = 'hidden';

    }

    leaveHidden() {

        this.DOM.el.style.visibility = 'visible';

    }

    mixBlendMode(
        value = this.$options.mixBlendMode,
    ) {

        this.DOM.el.style.mixBlendMode = value;

    }

    color(
        value = this.$options.customColor,
    ) {

        this.DOM.oval.style.borderColor = value;
        this.DOM.dot.style.backgroundColor = value;

}

    horizontalEnter(
        size = this.$options.size.hover
    ) {

        this.size = size;
        this.horizontal = true;

}

    horizontalLeave(
        size = this.$options.size.default
    ) {

        this.size = size;
        this.horizontal = false;

}

    horizontalDragStart(
        size = this.$options.size.default
) {

        this.size = size;
        this.horizontalDragging = true;

}

    horizontalDragEnd(
        size = this.$options.size.hover
) {

        this.size = size;
        this.horizontalDragging = false;

}
}
