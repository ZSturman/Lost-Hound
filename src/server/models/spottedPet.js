/**
 * This file is the model of the SpottedPet
 * --------------------------------
 * @module domain.SpottedPet
 */
class SpottedPet {
    constructor(
        authorName,
        spottedPostId,
        timeCreated,
        timeModified,
        isActive,
        authorID,
        lastSeenDatetime,
        lastSeenLocation,
        species,
        primaryColour,
        secondaryColour,
        size,
        state,
        additionalDetails,
        photo
    ) {
        // The name of the author who created the post
        this.authorName = authorName;

        // The unique identifier of the post
        this.spottedPostId = spottedPostId;

        // The timestamp when the post was created
        this.timeCreated = timeCreated;

        // The timestamp when the post was last modified
        this.timeModified = timeModified;

        // Indicates if the post is still active (true for active, false for inactive)
        this.isActive = isActive;

        // The unique identifier of the author who created the post
        this.authorID = authorID;

        // The datetime when the pet was last seen
        this.lastSeenDatetime = lastSeenDatetime;

        // The location where the pet was last seen
        this.lastSeenLocation = lastSeenLocation;

        // The species of the pet (e.g., dog, cat)
        this.species = species;

        // The primary color of the pet's fur or skin
        this.primaryColour = primaryColour;

        // The secondary color of the pet's fur or skin (if any)
        this.secondaryColour = secondaryColour;

        // The size of the pet (e.g., small, medium, large)
        this.size = size;

        // The state or region where the pet was lost
        this.state = state;

        // Any additional details about the lost pet
        this.additionalDetails = additionalDetails;

        // A photo of the lost pet
        this.photo = photo;
    }
}

export default SpottedPet;
