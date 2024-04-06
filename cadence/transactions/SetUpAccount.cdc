import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20
import QuickNFT from f8d6e0586b0a20c7

transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&QuickNFT.Collection>(from: QuickNFT.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- QuickNFT.createEmptyCollection()

        // Save it to the account
        signer.save(<-collection, to: QuickNFT.CollectionStoragePath)

        // Create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, QuickNFT.QuickNFTCollectionPublic, MetadataViews.ResolverCollection}>(
            QuickNFT.CollectionPublicPath,
            target: QuickNFT.CollectionStoragePath
        )
    }
}