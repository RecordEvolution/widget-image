export interface InputData {
    title: Block
    subTitle: Block
    imageLink: string
}

export interface Block {
    text: string,
    fontSize: string,
    fontWeight: string
    color: string
    backgroundColor: string
}