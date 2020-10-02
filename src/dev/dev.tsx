import * as Nano from '../core'
import { Snackbar } from '../ui/snackbar'
import { Dialog } from '../ui/dialog'
import { Fragment } from '../fragment'
import { Component } from '../component'
import { Navigation, NavigationAction } from '../ui/navigation'
import { Button } from '../ui/button'
import { AppBar, Toolbar } from '../ui/appBar'
import { Fab } from '../ui/fab'
import { Menu } from '../ui/menu'
import { List, ListItem } from '../ui/list'
import { Icon } from '../ui/icon'
import { Sheet } from '../ui/sheet'
import { Tabs, Tab } from '../ui/tabs'
import { Banner } from '../ui/banner'

const menu = new Menu()

const list = (
  <List>
    <ListItem>Normal</ListItem>
    <ListItem icon="/dev/font-awesome/heart-solid.svg">Icon</ListItem>
    <ListItem avatar="/dev/img/placeholder.png">Avatar</ListItem>
    <ListItem square="/dev/img/placeholder.png">Square</ListItem>
    <ListItem image="/dev/img/placeholder.png">Image</ListItem>
  </List>
)

const DialogBtn = () => {
  const dialog = new Dialog()

  const onclickHandler = () => {
    dialog.show({ title: 'Hello', body: 'Some text.', actions: [{ name: 'Action 1' }] }, (event) => {
      console.log(event)
    })
  }

  return <Button onClick={() => onclickHandler()}>DIALOG</Button>
}

const SnackbarBtn = (_props: any) => {
  const snackbar = new Snackbar({ offsetY: 56 })

  const onclickHandler = () => {
    snackbar.show(
      {
        // autoHide: false,
        //message: 'Hello Snack! asfd asd fasdf asd fasdf asf asdf asdf as',
      },
      (event) => {
        console.log(event)
      }
    )
  }

  return (
    <Button outlined onClick={() => onclickHandler()}>
      SNACKBAR
    </Button>
  )
}

class NavBar extends Component {
  icon(icon: string) {
    return `/dev/font-awesome/${icon}-solid.svg`
  }

  render() {
    console.log(window.location.pathname)
    const p = window.location.pathname

    return (
      <Navigation>
        <NavigationAction link="/dev/ui.html" label="Home" icon={this.icon('home')} active={p === '/dev/ui.html'} />
        <NavigationAction link="/dev/ui2.html" label="About" icon={this.icon('user')} active={p === '/dev/ui2.html'} />
        <NavigationAction label="Favorites" icon={this.icon('heart')} active={p === '/dev/ui3.html'} />
      </Navigation>
    )
  }
}

const Container = (props: any) => {
  return <div style="padding: 16px 16px 64px;">{props.children}</div>
}

const App = () => {
  return (
    <Fragment>
      <Container>
        <Banner sticky={152} />

        <div style="display: flex; flex-direction: column; align-items: start;">
          <SnackbarBtn />
          <DialogBtn />

          <Button>NORMAL</Button>
          <Button background="#d04fb3">ROSA</Button>
          <Button outlined>OUTLINED</Button>
          <Button outlined icon="/dev/font-awesome/user-solid.svg">
            ICON
          </Button>
          <Button text>TEXT</Button>
        </div>

        <div>{list}</div>

        <Icon src="/dev/font-awesome/ellipsis-v-solid.svg" />

        <div>
          <h2>What is Lorem Ipsum?</h2>

          <p>
            <strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
            into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
            release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
            software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          <h2>Where does it come from?</h2>
          <p>
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
            Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
            Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem
            Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable
            source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
            of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular
            during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
            section 1.10.32.
          </p>
          <p>
            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections
            1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
            original form, accompanied by English versions from the 1914 translation by H. Rackham.
          </p>
        </div>
      </Container>

      <Fab
        onClick={(e: MouseEvent) => {
          menu.open({ position: { x: e.clientX, y: e.clientY }, list })
        }}
        offsetY={56}
        mini
        left
      >
        <span style="font-size: 32px; line-height: 1;">+</span>
      </Fab>

      <Fab
        offsetY={56}
        onClick={() => {
          Sheet.Show(
            <Sheet mode="side" title="Title" subtitle="subtitle">
              <List>
                <ListItem>Inbox</ListItem>
                <ListItem>Sent</ListItem>
                <ListItem>Trash</ListItem>
              </List>
            </Sheet>
          )
        }}
      >
        <Icon size={28} color="white" src="/dev/font-awesome/heart-solid.svg" />
      </Fab>

      <Fab
        offsetY={56}
        extended
        center
        onClick={() => {
          Sheet.Show(
            <Sheet mode="bottom" title="Title" subtitle="subtitle">
              <List>
                <ListItem>Inbox</ListItem>
                <ListItem>Sent</ListItem>
                <ListItem>Trash</ListItem>
              </List>
            </Sheet>
          )
        }}
      >
        <span style="font-size: 24px; margin-right: 6px;">+</span>
        <span style="font-size: 14px;">ADD NEW</span>
      </Fab>

      {/* <NavBar /> */}
    </Fragment>
  )
}

const icons = {
  menu: (
    <Icon
      color="white"
      src={'/dev/font-awesome/ellipsis-v-solid.svg'}
      onClick={(e: MouseEvent) => {
        menu.open({ position: { x: e.clientX, y: e.clientY }, list })
        console.log('on click', e)
      }}
    />
  ),
}

const root = document.getElementById('root')

// Top Bar
Nano.tick(() => {
  Nano.render(
    <AppBar>
      <Toolbar menu title="Home Page" icons={icons} />
      <Tabs active={1}>
        <Tab>first</Tab>
        <Tab>second</Tab>
        <Tab>third</Tab>
      </Tabs>
      <Tabs scroll active={1}>
        <Tab>first</Tab>
        <Tab>second</Tab>
        <Tab>third</Tab>
        <Tab>fourth</Tab>
        <Tab>fifth</Tab>
        <Tab>sixth</Tab>
        <Tab>seventh</Tab>
        <Tab>eight</Tab>
        <Tab>ninth</Tab>
      </Tabs>
    </AppBar>,
    document.body,
    false
  )
})

// Content
Nano.tick(() => {
  root?.setAttribute('style', 'margin-top: 152px; margin-bottom: 56px;')
  Nano.render(<App />, root)
})

// Bottom Bar
Nano.tick(() => {
  Nano.render(<NavBar />, document.body, false)
})
