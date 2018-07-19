/* eslint-disable flowtype/no-weak-types */
/* @flow */
import Docker from 'dockerode'

type Container = {
  metadata: { [string]: any },
  dockerode: {
    container: Docker.Container
  }
}

export async function startContainer(options: {
  Image: string
}): Promise<Container> {
  const docker = new Docker()

  await pullImage(docker, options.Image)

  const container = await docker.createContainer(options)
  await container.start()
  const metadata = await container.inspect()

  return {
    metadata,
    dockerode: { container }
  }
}

export async function stopContainer({
  dockerode: { container }
}: Container): Promise<void> {
  await container.stop()
  await container.remove()
}

async function pullImage(docker: Docker, image: string): Promise<void> {
  const stream = await docker.pull(image)
  await new Promise(resolve => {
    docker.modem.followProgress(stream, resolve)
  })
}
