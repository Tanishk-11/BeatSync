import pkg_resources

libraries = [
    "fastapi",
    "uvicorn",
    "python-multipart",
    "tensorflow",
    "h5py",
    "opencv-python",
    "dlib",
    "mediapipe",
    "numpy",
    "scipy",
    "scikit-image",
]

print("Checking versions for video_model_service:")
for lib in libraries:
    try:
        # The package name for dlib might just be 'dlib'
        dist = pkg_resources.get_distribution(lib)
        print(f"{dist.project_name}=={dist.version}")
    except pkg_resources.DistributionNotFound:
        print(f"'{lib}' is not installed.")
    except Exception as e:
        print(f"Could not check version for '{lib}': {e}")